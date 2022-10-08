import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoUserSchema } from "./models/user.model";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "MongoUser", schema: MongoUserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    { provide: "UserService", useExisting: UserService },
    { provide: "UserRepository", useExisting: UserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
