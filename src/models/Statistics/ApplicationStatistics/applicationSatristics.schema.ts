import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { Genders, IndustriesFeilds } from '@Shared/Enums';

@Schema({ timestamps: true })
export class ApplicationRecord
{
@Prop({type:SchemaTypes.ObjectId,required:true,ref:'JobRecord'})
jobId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:'Company'})
companyId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:'User'})
applicantId:Types.ObjectId

@Prop({type:String,enum:IndustriesFeilds,required:true})
applicantIndustry:IndustriesFeilds

@Prop({type:String,enum:Genders,required:true})
applicantGender:Genders

@Prop({type:Number,required:false,default:0})
matchScore:number

@Prop({type:Boolean,required:false})
applicationOutcome:boolean

@Prop({type:Date,default:()=>new Date()})
appliedAt:Date
}

export const ApplicationRecordSchema = SchemaFactory.createForClass(ApplicationRecord);
