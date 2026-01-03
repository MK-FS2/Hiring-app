import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema({timestamps:false})
export class InterviewRecord
{
@Prop({type:SchemaTypes.ObjectId,required:true,ref:'JobRecord'})
jobId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true})
interviewId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:'ApplicationRecord'})
applicationId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:'Company'})
companyId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:'User'})
applicantId:Types.ObjectId

@Prop({type:Date,required:false,default:new Date()})
scheduledAt?:Date

@Prop({type:Date,required:false})
completedAt?:Date

@Prop({type:Boolean,required:false})
interviewOutcome?:boolean
}

export const InterviewRecordSchema = SchemaFactory.createForClass(InterviewRecord);
