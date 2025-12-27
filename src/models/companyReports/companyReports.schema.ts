import { SchemaTypes, Types} from 'mongoose';

import {Prop,Schema,SchemaFactory} from "@nestjs/mongoose";
import { CarerExperienceLevels,Genders,HrActionsTypes,IndustriesFeilds} from '@Shared/Enums';



@Schema({timestamps:false,_id:false})
export class JobStat 
{
@Prop({type:SchemaTypes.ObjectId,required:true})
jobId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true})
creatorId:Types.ObjectId 

@Prop({type:SchemaTypes.ObjectId,required:false,default:0})
timesRejected:number

@Prop({type:String,enum:IndustriesFeilds,required:true})
jobIndustry:IndustriesFeilds

@Prop({type:Date,required:false,default:new Date()})
createdAt:Date 

@Prop({type:String,enum:CarerExperienceLevels,required:true})
requiredLevel:CarerExperienceLevels

@Prop({type:Number,required:false,default:0})
views:number 

@Prop({type:Number,required:false,default:0})
saves:number 

@Prop({type:Number,default:0})
applies:number
}


@Schema({timestamps:false,_id:false})
export class ApplicationStat 
{
 @Prop({type:SchemaTypes.ObjectId,required:true})   
 applicationId:Types.ObjectId   

 @Prop({type:SchemaTypes.ObjectId,required:true})
 jobId:Types.ObjectId 

 @Prop({type:String,enum:IndustriesFeilds,required:true})
 applicantIndustry:IndustriesFeilds 

 @Prop({type: Date, required: true })
 appliedAt:Date  

 @Prop({type:String,enum:Genders,required:true})
 applicantGender:Genders

 @Prop({type:Number,required:false})
 matchScore:number

 @Prop({type:Boolean})
 applicationOutcome:boolean

}


@Schema({timestamps:false,_id:false})
export class InterviewSatat 
{
 @Prop({type:SchemaTypes.ObjectId,required:true})  
 interviewId:Types.ObjectId 

 @Prop({type:SchemaTypes.ObjectId,required:true})  
 jobId:Types.ObjectId

 @Prop({type:SchemaTypes.ObjectId,required:true})  
 applicationId:Types.ObjectId

 @Prop({type:Date,required:true})
 scheduledAt: Date  

 @Prop({type:Date,required:false})
 completedAt: Date 

 @Prop({type:Boolean,required:false})
 interviewOutcome:boolean
}


@Schema({timestamps:true,_id:false})
export class EmployeeAction 
{
@Prop({type:SchemaTypes.ObjectId,required:true})
employeeId:Types.ObjectId  

@Prop({type:Date,required:false,default:new Date()})
doneAt:Date

@Prop({type:String,enum:HrActionsTypes,required:true})
targetType:HrActionsTypes  
}


@Schema({timestamps:false})
export class EmployeeStat 
{
@Prop({type:Date})
joinedAt:Date 

@Prop({type:[EmployeeAction],required:false})
actions:EmployeeAction[]
}


@Schema({timestamps:false,_id:false})
export class CompanyStatistics 
{
@Prop({type:SchemaTypes.ObjectId,required:true})
CompanyId:Types.ObjectId

@Prop({type:[JobStat],required:false})
jobs:JobStat[]

@Prop({type:[ApplicationStat],required:false})
applications:ApplicationStat[] 

@Prop({type:[InterviewSatat],required:false})
interviews:InterviewSatat[]

@Prop({type:[EmployeeStat],required:false})
employee:EmployeeStat[]

}


export const CompanyStatisticsSchema = SchemaFactory.createForClass(CompanyStatistics)