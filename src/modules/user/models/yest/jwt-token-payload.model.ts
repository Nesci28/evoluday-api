/* eslint-disable no-use-before-define */
import { JwtTokenPayload } from "@evoluday/evoluday-api-typescript-fetch";
import { MongoBase, MongoBaseChild } from "@yest/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
export type JwtTokenPayloadDocument = MongoJwtTokenPayload & Document;

@Schema(
  {
    collection: "mongojwttokenpayload",
timestamps: true,
  },
)
export class MongoJwtTokenPayload extends MongoBase implements JwtTokenPayload {
        @Prop({
          type: String,
          required: true,
        })
        public userId: string;
      
        @Prop({
          type: String,
          required: true,
enum: ["Admin", "Member", "E2E"],
        })
        public roles: string[];
      }

const schema = SchemaFactory.createForClass(MongoJwtTokenPayload);
schema.pre("save", MongoJwtTokenPayload.preSave);
schema.pre("insertMany", MongoJwtTokenPayload.preInsertMany);
schema.pre("updateOne", MongoJwtTokenPayload.preUpdateOne);
schema.pre("findOneAndUpdate", MongoJwtTokenPayload.preUpdateOne);
schema.plugin(mongoosePaginate);

export const MongoJwtTokenPayloadSchema = schema;
