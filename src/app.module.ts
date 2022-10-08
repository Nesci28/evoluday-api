import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { YestHealthcheckModule } from "@yest/healthcheck";
import { YestMinioModule } from "@yest/minio";
import {
  InternalServerInterceptor,
  ResultHandlerInterceptor,
  ScopeInterceptor,
  YestRouterModule,
} from "@yest/router";
import { JwtTokenGuard, YestSecurityModule } from "@yest/security";
import * as Joi from "joi";
import { cloneDeep } from "lodash";
import { v4 } from "uuid";

import { configs } from "./constants/configs.constant";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthService } from "./modules/auth/auth.service";
import { UserModule } from "./modules/user/user.module";

const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    CORS: Joi.string(),
    BODY_LIMIT_SIZE: Joi.string().required(),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_URL: Joi.string().required(),
    MONGO_DB: Joi.string().required(),
    JWT_PUBLIC_KEY: Joi.string().required(),
    JWT_PRIVATE_KEY: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    REFRESH_PUBLIC_KEY: Joi.string().required(),
    REFRESH_PRIVATE_KEY: Joi.string().required(),
    REFRESH_EXPIRATION_LONG: Joi.string().required(),
    REFRESH_EXPIRATION_SHORT: Joi.string().required(),
    EMAIL_HOST: Joi.string().equal("smtp.sendgrid.net"),
    EMAIL_USER: Joi.string().equal("apikey"),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_FROM: Joi.string().required(),
    TWILIO_ACCOUNT_SID: Joi.string().required(),
    TWILIO_AUTH_TOKEN: Joi.string().required(),
  }),
});

const yestHealthcheckModule = YestHealthcheckModule.forRoot();

const yestRouterModule = YestRouterModule.forRoot({
  apiDoc: configs.resolvedPath,
});

const yestMinio = YestMinioModule.registerAsync({
  create: [JwtTokenGuard],
  update: [JwtTokenGuard],
  delete: [JwtTokenGuard],
});

const mongooseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const username = configService.get("MONGO_USERNAME");
    const password = configService.get("MONGO_PASSWORD");
    const database = configService.get("MONGO_DB");
    const host = configService.get("MONGO_URL");

    return {
      uri: `mongodb://${username}:${password}@${host}`,
      dbName: database,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  },
});

const throttlerModule = ThrottlerModule.forRoot({
  ttl: 60,
  limit: 500,
});

export const appImports = [
  configModule,
  YestSecurityModule.forRootAsync(YestSecurityModule, {
    imports: [AuthModule],
    inject: [AuthService],
    useFactory: (authService: AuthService) => {
      return {
        uuid: v4(),
        authService,
      };
    },
  }),
];

const moduleImports = [AuthModule, UserModule];

const appProviders = [
  {
    provide: APP_FILTER,
    useClass: ResultHandlerInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: ScopeInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: InternalServerInterceptor,
  },
];

export const meta = {
  imports: [
    yestHealthcheckModule,
    yestMinio,
    throttlerModule,
    ...appImports,
    ...moduleImports,
  ],
  providers: [...appProviders],
};
const metaCloned = cloneDeep(meta);
metaCloned.imports.push(yestRouterModule, mongooseModule);

@Module(metaCloned)
export class AppModule {}
