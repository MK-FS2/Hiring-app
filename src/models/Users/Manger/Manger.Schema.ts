import { FileSchema } from './../../common/FileSchema';
import { Genders, UserAgent } from "@Shared/Enums";
import { SchemaTypes, Types } from "mongoose";
import { OTPSchema } from '../BaseUser';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Manger 
{
readonly Role?:string;
readonly _id?:Types.ObjectId;
firstName:string;
phoneNumber:string;
gender:Genders;
lastName:string;
email:string;
password:string;
profilePic?:FileSchema
coverPic?: FileSchema 
bannedAt?: Date;
isBanned?: boolean;
isVerified?: boolean;
dateofbirth: Date;
provider: UserAgent;
deletedAt?: Date;  
OTP?: OTPSchema[]; 

@Prop({type:SchemaTypes.ObjectId,ref:"Company"})
companyId?:Types.ObjectId

@Prop({type:Boolean,required:false,default:false})
createdAcompany?:boolean
}

export const MangerSchema = SchemaFactory.createForClass(Manger)