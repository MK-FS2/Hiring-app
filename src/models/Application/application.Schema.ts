import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApplicationStatus, Genders } from "@Shared/Enums";
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

@Prop({type:String,enum:ApplicationStatus,required:false,default:ApplicationStatus.Pending})
status?:ApplicationStatus

@Prop({type:String,required:true})
applicantName:string

@Prop({type:String,required:true})
applicantEmail:string

@Prop({type:String,required:true})
applicantPhone:string

@Prop({type:String,enum:Genders,required:true})
applicantGender:Genders

@Prop({type: Number,required:false,validate: 
    {
        validator: function(value: number) 
        {
            return value >= 0 && value <= 100;
        },
        message: 'matchingScore must be between 0 and 100'
        }
     })
    matchingScore?:number;

}

export const  ApplicationSchema = SchemaFactory.createForClass(Application)