/* eslint-disable no-use-before-define */
import { RefreshToken } from "@evoluday/evoluday-api-typescript-fetch";
import { MongoBase, MongoBaseChild, getRefModel } from "@yest/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema(
  {
    _id: false,
  },
)
class MongoRefreshToken extends MongoBaseChild implements RefreshToken {
      @Prop({
        type: String,
        required: true,
      })
      public token: string;
      
      @Prop({
        type: String,
        required: true,
      })
      public userAgentUuid: string;
      
      @Prop({
        type: String,
        required: true,
      })
      public userAgent: string;
      }

const schema = SchemaFactory.createForClass(MongoRefreshToken);


export const MongoRefreshTokenSchema = schema;
