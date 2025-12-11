import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";


@Schema({timestamps:{createdAt:true}})
export class Application  
{
@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Company"})
companyId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Job"})
jobId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Applicant"})
applicantId:Types.ObjectId

@Prop({type:FileSchema,required:true})
cv:FileSchema
}

export const  ApplicationSchema = SchemaFactory.createForClass(Application)