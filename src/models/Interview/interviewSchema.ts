import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApplicationStatus } from "@Shared/Enums";
import { SchemaTypes, Types } from "mongoose";



@Schema()
export class Interview
{
@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Application"})
applicationId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Job"})
jobId:Types.ObjectId

@Prop({type:SchemaTypes.ObjectId,required:true,ref:"Company"})
companyId:Types.ObjectId

@Prop({type: Date,required:false,validate: 
    {
    validator: (value: Date) => 
    {
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      return value.getTime() >= Date.now() + ONE_DAY_MS;
    },
    message: 'Interview date must be at least 1 day in the future',
  },
})
interviewDate?: Date;

@Prop({type:String,required:false})
interviewTime?:string

@Prop({type:String,enum:ApplicationStatus,required:false,default:ApplicationStatus.Pending})
status?:ApplicationStatus

}
export const InterviewSchema = SchemaFactory.createForClass(Interview)