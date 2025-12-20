import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { OTPSchema } from "../BaseUser";
import { Degrees, Genders, IndustriesFeilds, UserAgent } from "@Shared/Enums";




@Schema({timestamps:false})
export class EducationSchema 
{
@Prop({type:String,enum:Degrees,required:true})
degree: Degrees

@Prop({type:String,required:true,minLength:[2,"Minimum of 2 charcters"],maxLength:[100,"Maximum of 100 chracters"]})
institution:string

@Prop({type: Date,required: true,validate:{
    validator: (value: Date) => {return value <= new Date();},
    message: 'Start date cannot be in the future',
  },
})
startDate:Date 

@Prop({type:Date,required: true,validate:
{
    validator:function (value:Date) 
    {
      return !this.startDate || value >= this.startDate;
    },
    message: 'End date must be after start date',
  },
})
endDate:Date
}


@Schema()
export class CvSchema
{
  @Prop({type:String,required:true})
  cvName:string

  @Prop({type:FileSchema,required:true})
  cvFile:FileSchema
}


@Schema({timestamps:{createdAt:true}})
export class Applicant 
{
readonly Role?: string;
readonly _id?: Types.ObjectId;
firstName:string;
phoneNumber?:string;
gender?: Genders;
lastName: string;
email: string;
password?: string;
profilePic?:FileSchema
coverPic?: FileSchema 
bannedAt?: Date;
isBanned?: boolean;
isVerified?: boolean;
dateofbirth?: Date;
provider:UserAgent;
deletedAt?: Date;  
OTP?: OTPSchema[]; 
changedCredentialsAt?:Date;

@Prop({type: String,enum:IndustriesFeilds,required: function(this:Applicant) { return this.provider === UserAgent.System; } })
industry?:IndustriesFeilds

@Prop({ type: String, required: function(this: Applicant) { return this.provider === UserAgent.System; }, minlength: [2, "Minimum of 2 characters"], maxlength: [100, "Maximum of 100 characters"] })
titel?:string


@Prop({type:[String],required: false,default: [],validate:{
    validator: (value: string[]) => value.length <= 15,
    message: 'A maximum of 15 skills is allowed',
  },
})
skills?:string[];

@Prop({type: String,required:false})
description?:string;

@Prop({type:[FileSchema],required:false})
certifications?:FileSchema[]


@Prop({type:[CvSchema],required:false})
CVS?: CvSchema[];


@Prop({type:[EducationSchema],required:false})
education?:EducationSchema[]

@Prop({type:String,required:false,maxLength:[50,"Maximum of 50 characters"]})
coverLetter?:string


@Prop({type:Boolean,required:false,default:true})
availability?:boolean

}


export const ApplicantSchema  = SchemaFactory.createForClass(Applicant)