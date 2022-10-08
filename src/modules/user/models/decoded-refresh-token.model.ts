/* eslint-disable no-use-before-define */
import { DecodedRefreshToken } from "@evoluday/evoluday-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoBase } from "@yest/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

export type DecodedRefreshTokenDocument = MongoDecodedRefreshToken & Document;

@Schema({
  collection: "mongodecodedrefreshtoken",
  timestamps: true,
})
export class MongoDecodedRefreshToken
  extends MongoBase
  implements DecodedRefreshToken
{
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

  @Prop({
    type: String,
  })
  public userDealerId?: string;

  @Prop({
    type: Number,
    required: true,
  })
  public iat: number;

  @Prop({
    type: Number,
    required: true,
  })
  public exp: number;
}

const schema = SchemaFactory.createForClass(MongoDecodedRefreshToken);
schema.pre("save", MongoDecodedRefreshToken.preSave);
schema.pre("insertMany", MongoDecodedRefreshToken.preInsertMany);
schema.pre("updateOne", MongoDecodedRefreshToken.preUpdateOne);
schema.pre("findOneAndUpdate", MongoDecodedRefreshToken.preUpdateOne);
schema.plugin(mongoosePaginate);

export const MongoDecodedRefreshTokenSchema = schema;
