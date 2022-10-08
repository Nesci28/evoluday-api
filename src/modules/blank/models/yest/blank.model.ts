/* eslint-disable no-use-before-define */
import { Blank } from "@evoluday/evoluday-api-typescript-fetch";
import { MongoBase, MongoBaseChild } from "@yest/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
export type BlankDocument = MongoBlank & Document;

@Schema(
  {
    collection: "mongoblank",
timestamps: true,
  },
)
export class MongoBlank extends MongoBase implements Blank {
        @Prop({
          type: String,
          
        })
        public blank?: string;
      }

const schema = SchemaFactory.createForClass(MongoBlank);
schema.pre("save", MongoBlank.preSave);
schema.pre("insertMany", MongoBlank.preInsertMany);
schema.pre("updateOne", MongoBlank.preUpdateOne);
schema.pre("findOneAndUpdate", MongoBlank.preUpdateOne);
schema.plugin(mongoosePaginate);

export const MongoBlankSchema = schema;
