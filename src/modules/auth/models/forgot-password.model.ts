/* eslint-disable no-use-before-define */
import { ForgotPassword } from "@evoluday/evoluday-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoBase } from "@yest/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

export type ForgotPasswordDocument = MongoForgotPassword & Document;

@Schema({
  collection: "mongoforgotpassword",
  timestamps: true,
})
export class MongoForgotPassword extends MongoBase implements ForgotPassword {
  @Prop({ type: String, required: true, index: true })
  public token: string;

  @Prop({ type: String, required: true, index: true })
  public email: string;

  @Prop({ type: Date, index: true, default: new Date().toISOString() })
  public date: Date;
}

const schema = SchemaFactory.createForClass(MongoForgotPassword);
schema.pre("save", MongoForgotPassword.preSave);
schema.pre("insertMany", MongoForgotPassword.preInsertMany);
schema.pre("updateOne", MongoForgotPassword.preUpdateOne);
schema.pre("findOneAndUpdate", MongoForgotPassword.preUpdateOne);
schema.plugin(mongoosePaginate);

export const MongoForgotPasswordSchema = schema;
