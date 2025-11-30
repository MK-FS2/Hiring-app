import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true })
export class Token 
{
  @Prop({ type: String, required: true })
  accessToken: string;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: "User" })
  userId: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
