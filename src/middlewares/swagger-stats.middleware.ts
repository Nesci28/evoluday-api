import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { swsInterface } from "@okidoo/ts-swagger-stats-redis";
import { Promise } from "bluebird";
import { NextFunction, Request, Response } from "express";
import * as pm2Cb from "pm2";
import { Aggregator, MetricType } from "prom-client";
import { v4 } from "uuid";

type CollectFunction<T> = (this: T) => void | Promise<void>;

/* Info returned by pm2.list() */
interface PM2InstanceData {
  pm_id: number;
}

/** Response packet sent to the master instance */
interface ResponsePacket {
  type: string;
  data: {
    instanceId: number;
    register: any;
    success: boolean;
    reqId: string;
  };
}

interface metric {
  name: string;
  help: string;
  type: MetricType;
  aggregator: Aggregator;
  collect: CollectFunction<any>;
}

/** IPC request packet sent from the master instance to the others */
interface RequestPacket {
  topic: "get_prom_register";
  data: {
    /** ID if the master instance */
    targetInstanceId: number;
    /** Unique request ID to prevent collisions from multiple requests */
    reqId: string;
  };
}

/** Main middleware function */
export class SwaggerStatsMiddleware {
  /* if you use Bluebird, it makes using PM2 API easier, creating *Async functions */
  private pm2 = Promise.promisifyAll(pm2Cb) as any;

  /** Total timeout for workers, ms */
  private TIMEOUT = 2000;

  private promClient = (swsInterface as any).getPromClient();

  /** The global message topic for gathering Prometheus metrics */
  private TOPIC: "get_prom_register" = "get_prom_register";

  /** Singleton instance of PM2 message bus */
  private pm2Bus;

  private instanceId = Number(process.env.pm_id);

  private logger = new Logger("Swagger-stats");

  constructor(private readonly configService: ConfigService) {
    /** Every process listens on the IPC channel for the metric request TOPIC,
    responding with Prometheus metrics when needed. */
    process.on("message", (packet: RequestPacket) => {
      try {
        if (packet.topic === this.TOPIC) {
          (process as any).send({
            type: `process:${packet.data.targetInstanceId}`,
            data: {
              instanceId: this.instanceId,
              register: this.promClient.register.getMetricsAsJSON(),
              success: true,
              reqId: packet.data.reqId,
            },
          } as ResponsePacket);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error sending metrics to master node", e);
      }
    });
  }

  public async use(
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ): Promise<void> {
    try {
      // this.logger.debug("Metrics scraping");
      const usernameEnv = this.configService.get("SWAGGER_STATS_USERNAME");
      const passwordEnv = this.configService.get("SWAGGER_STATS_PASSWORD");
      const { query } = req;
      let { username, password } = query;

      if (!username && !password) {
        const { headers } = req;
        const { authorization } = headers;
        if (authorization) {
          const cleanedAuthorization = authorization.replace("Basic ", "");
          const decodedBase64 = Buffer.from(
            cleanedAuthorization,
            "base64",
          ).toString();
          const [usernameHeader, passwordHeader] = decodedBase64.split(":");
          username = usernameHeader;
          password = passwordHeader;
        }
      }

      if (username !== usernameEnv || password !== passwordEnv) {
        res.send("Authentication failed");
      }

      // create or use bus singleton
      this.pm2Bus = this.pm2Bus || (await this.pm2.launchBusAsync());

      // get current instances (threads) data
      const instancesData = await this.pm2.listAsync();
      if (instancesData.length > 1) {
        // multiple threads - aggregate
        const register = await this.getAggregatedRegistry(instancesData);
        const metrics = await register.metrics();
        res.send(metrics);
      } else {
        // 1 thread - send local stats
        const metrics = await (swsInterface as any).getPromStats();
        res.send(metrics);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  private async requestNeighboursData(
    instancesData: PM2InstanceData[],
    reqId: string,
  ): Promise<any[]> {
    const requestData: RequestPacket = {
      topic: this.TOPIC,
      data: {
        targetInstanceId: this.instanceId,
        reqId,
      },
    };

    const promises: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const instanceData of Object.values(instancesData)) {
      const targetId = instanceData.pm_id;
      // don't send message to self
      if (targetId !== this.instanceId) {
        promises.push(
          this.pm2
            .sendDataToProcessIdAsync(targetId, requestData)
            .catch((e) => {
              // eslint-disable-next-line no-console
              return console.error(e);
            }),
        );
      }
    }

    // Resolves when all responses have been received
    return Promise.all(promises);
  }

  /** Master process gathering aggregated metrics data */
  private async getAggregatedRegistry(
    instancesData: PM2InstanceData[],
  ): Promise<any> {
    if (!instancesData || !instancesData.length) {
      return;
    }

    // assigning a unique request ID
    const reqId = v4();

    const registryPromise = new Promise<any>((resolve, reject) => {
      const instancesCount = instancesData.length;
      const registersPerInstance: Promise<metric[]>[] = [];
      const busEventName = `process:${this.instanceId}`;
      // master process metrics
      registersPerInstance[this.instanceId] =
        this.promClient.register.getMetricsAsJSON();
      let registersReady = 1;

      const finish = async (): Promise<void> => {
        // deregister event listener to prevent memory leak
        this.pm2Bus.off(busEventName);
        const registersPerInstanceResolved = await Promise.all(
          registersPerInstance,
        );

        const registersPerInstanceResolvedAndConverted =
          registersPerInstanceResolved
            .map((x) => {
              return Array.isArray(x) ? x : undefined;
            })
            .filter(Boolean);

        const aggregate = this.promClient.AggregatorRegistry.aggregate(
          registersPerInstanceResolvedAndConverted as any,
        );
        resolve(aggregate);
      };

      // we can only resolve/reject this promise once
      // this safety timeout deregisters the listener in case of an issue
      const timeout = setTimeout(finish, this.TIMEOUT);

      /** Listens to slave instances' responses */
      this.pm2Bus.on(busEventName, (packet: ResponsePacket) => {
        try {
          if (packet.data.reqId === reqId) {
            // array fills up in order of responses
            registersPerInstance[packet.data.instanceId] = packet.data.register;
            registersReady += 1;

            if (registersReady === instancesCount) {
              // resolve when all responses have been received
              clearTimeout(timeout);
              finish();
            }
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    // request instance data after the response listener has been set up
    // we are not awaiting, resolution is handled by the bus event listener
    this.requestNeighboursData(instancesData, reqId);

    return registryPromise;
  }
}
