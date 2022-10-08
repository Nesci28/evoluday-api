import { Logger } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { swsInterface } from "@okidoo/ts-swagger-stats-redis";
import { SwsOptions } from "@okidoo/ts-swagger-stats-redis/dist/interfaces/options.interface";
import * as express from "express";
import helmet from "helmet";
import * as morgan from "morgan";
import * as YAML from "yamljs";

import { AppModule } from "./app.module";
import { configs } from "./constants/configs.constant";
import { SwaggerStatsMiddleware } from "./middlewares/swagger-stats.middleware";

async function bootstrap(): Promise<void> {
  const logger = new Logger("main");

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsUrl = configService.get("CORS") || "*";
  const port = configService.get("API_PORT") || 3000;
  const bodyLimitSize = configService.get("BODY_LIMIT_SIZE") || 5;
  const corsConfig: CorsOptions = {
    origin: corsUrl,
    methods: "GET,HEAD,PATCH,POST,DELETE,OPTIONS,PUT",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  const swaggerSpec = YAML.load(configs.resolvedPath);
  const swStatsUsername = configService.get("SWAGGER_STATS_USERNAME");
  const swStatsPassword = configService.get("SWAGGER_STATS_PASSWORD");
  const swStatsElasticUrl = app
    .get(ConfigService)
    .get("SWAGGER_STATS_ELASTIC_URL");
  const swaggerStatsConfigs: Partial<SwsOptions> = {
    mongoUrl: configService.get("MONGO_URL"),
    mongoUsername: configService.get("MONGO_USERNAME"),
    mongoPassword: configService.get("MONGO_PASSWORD"),
    redisHost: configService.get("REDIS_HOST"),
    redisPort: configService.get("REDIS_PORT"),
    swaggerStatsMongoDb: "swagger-stats",
    swaggerSpec,
    authentication: true,
    elasticsearch: swStatsElasticUrl,
    swaggerOnly: true,
    onAuthenticate: (_, user, pass) => {
      return user === swStatsUsername && pass === swStatsPassword;
    },
  };
  const swaggerStatsMiddleware = new SwaggerStatsMiddleware(configService);

  app.use("/swagger-stats/metrics", (req, res, next) => {
    swaggerStatsMiddleware.use(req, res, next);
  });
  app.use(await swsInterface.getMiddleware(swaggerStatsConfigs as SwsOptions));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors(corsConfig);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: `${bodyLimitSize}` }));
  app.use(morgan("tiny"));

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
