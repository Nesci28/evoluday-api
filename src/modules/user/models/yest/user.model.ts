/* eslint-disable no-use-before-define */
import {
  RefreshToken,
  User,
} from "@evoluday/evoluday-api-typescript-fetch";
import { MongoBase, MongoBaseChild, getRefModel } from "@yest/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import { MongoRefreshToken } from "./refresh-token.model";
export type UserDocument = MongoUser & Document;

@Schema(
  {
    collection: "mongouser",
timestamps: true,
  },
)
export class MongoUser extends MongoBase implements User {
      @Prop({
        type: String,
        required: true,
      })
      public email: string;
      
      @Prop({
        type: String,
        required: true,
enum: ["Admin", "Member", "E2E"],
      })
      public roles: string[];
      
      @Prop({
        type: MongoRefreshToken,
        
      })
      public refreshTokens?: RefreshToken;
    
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


export const MongoUserSchema = schema;
