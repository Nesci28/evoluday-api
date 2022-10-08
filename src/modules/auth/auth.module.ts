import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LocalStrategy } from "../../passport/local/local.strategy";
import { NotificationModule } from "../../services/notification/notification.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { JwtModule } from "./jwt.module";
import { MongoForgotPasswordSchema } from "./models/forgot-password.model";
import { RefreshLongModule } from "./refresh-long.module";
import { RefreshShortModule } from "./refresh-short.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "MongoForgotPassword", schema: MongoForgotPasswordSchema },
    ]),
    UserModule,
    JwtModule,
    RefreshLongModule,
    NotificationModule,
    RefreshShortModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    { provide: "AuthService", useExisting: AuthService },
    { provide: "AuthRepository", useExisting: AuthRepository },
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
