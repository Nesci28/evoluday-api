/* eslint-disable no-use-before-define */
import {
  RefreshToken,
  User,
  UserRole,
} from "@evoluday/evoluday-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoBase } from "@yest/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

import { MongoRefreshTokenSchema } from "./refresh-token.model";

export type UserDocument = MongoUser & Document;

@Schema({
  collection: "mongouser",
  timestamps: true,
})
export class MongoUser extends MongoBase implements User {
  @Prop({
    type: String,
    required: true,
  })
  public email: string;

  @Prop({
    type: [String],
    required: true,
    enum: ["Admin", "Member", "E2E"],
  })
  public roles: UserRole[];

  @Prop({
    type: [MongoRefreshTokenSchema],
  })
  public refreshTokens: RefreshToken[];

  @Prop({
    type: String,
  })
  public password?: string;
}

const schema = SchemaFactory.createForClass(MongoUser);
schema.pre("save", MongoUser.preSave);
schema.pre("insertMany", MongoUser.preInsertMany);
schema.pre("updateOne", MongoUser.preUpdateOne);
schema.pre("findOneAndUpdate", MongoUser.preUpdateOne);
schema.plugin(mongoosePaginate);

export const MongoUserSchema = schema;
