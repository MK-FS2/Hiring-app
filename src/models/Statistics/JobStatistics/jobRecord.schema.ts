import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { CarerExperienceLevels, IndustriesFeilds, WorkplaceTypes } from '@Shared/Enums';

@Schema({timestamps:{createdAt:true,updatedAt:false}})
export class JobRecord 
{
  @Prop({type:SchemaTypes.ObjectId,required:true,ref:'Company'})
  companyId:Types.ObjectId;

  @Prop({type:SchemaTypes.ObjectId,required:true})
  jobId:Types.ObjectId

  @Prop({type:SchemaTypes.ObjectId,required:true,ref:'HR'})
  creatorId:Types.ObjectId;

  @Prop({type:Number,default:0,required:false})
  timesRejected?:number;

  @Prop({type:String,enum:WorkplaceTypes,required:true})
  workplaceType:WorkplaceTypes

  @Prop({type:String,enum:CarerExperienceLevels,required:true})
  requiredCarerLevel: CarerExperienceLevels;

  @Prop({type:Number,required:false})
  minsalary?:number

   @Prop({type:Number,required:false})
  maxsalary?:number

  @Prop({type:String,enum:IndustriesFeilds,required:true})
  jobIndustry: IndustriesFeilds;


  @Prop({type:Number,default:0,required:false})
  views?:number;

  @Prop({type:Number,default:0,required:false})
  saves?:number;

  @Prop({type:Number,default:0,required:false})
  applications?:number;

}

export const JobRecordSchema = SchemaFactory.createForClass(JobRecord);
