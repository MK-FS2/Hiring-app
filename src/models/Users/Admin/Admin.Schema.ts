import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { OTPSchema } from "../BaseUser";
import { Genders, UserAgent } from "@Shared/Enums";
import { FileSchema } from "@Models/common";
import { Types } from "mongoose";


@Schema({timestamps:{createdAt:true}})
export class Admin 
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
provider:UserAgent;
deletedAt?: Date;  
OTP?:OTPSchema[]; 
changedCredentialsAt?:Date;
}


export const AdminSchema = SchemaFactory.createForClass(Admin)