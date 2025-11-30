import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { OTPSchema} from "../BaseUser";
import { FileSchema } from "@Models/common";
import { SchemaTypes, Types } from "mongoose";
import { Genders, HRPermissions, UserAgent } from "@Shared/Enums";

@Schema({timestamps:{createdAt:true}})
export class HR 
{
readonly Role: string;
readonly _id: Types.ObjectId;
firstName: string;
phoneNumber: string;
gender: Genders;
lastName: string;
email: string;
password: string;
profilePic?:FileSchema
coverPic?: FileSchema 
bannedAt?: Date;
isBanned: boolean;
isVerified: boolean;
dateofbirth: Date;
provider: UserAgent;
deletedAt?: Date;  
OTP?: OTPSchema[]; 
changedCredentialsAt?:Date;

@Prop({type:SchemaTypes.ObjectId,ref:"Company"})
companyId:Types.ObjectId

@Prop({type:Date,required:true})
hireDate:Date;

@Prop({ type:[String],enum:HRPermissions,default:[]})
permissions?:HRPermissions[]
}

export const HRSchema = SchemaFactory.createForClass(HR)