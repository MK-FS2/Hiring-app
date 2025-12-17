import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApplicationStatus, Genders } from "@Shared/Enums";
import { SchemaTypes, Types } from "mongoose";
import dotenv from "dotenv"
import { InternalServerErrorException } from "@nestjs/common";
import CryptoJS from "crypto-js";
dotenv.config()

@Schema({timestamps:{createdAt:true,updatedAt:false},toJSON:{virtuals:true},toObject:{virtuals:true}})
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

const key = process.env.Encryptionkey!;
if (!key) throw new InternalServerErrorException("EncryptionKey is missing in env");


ApplicationSchema.post("find", function(docs: Application[]) 
{
    for (const doc of docs) 
    {
        if (doc.applicantPhone) 
        {
            doc.applicantPhone = CryptoJS.AES.decrypt(doc.applicantPhone, key).toString(CryptoJS.enc.Utf8);
        }
    }
});


ApplicationSchema.post("findOne", function(doc: Application) 
{
    if (doc?.applicantPhone) 
    {
        doc.applicantPhone = CryptoJS.AES.decrypt(doc.applicantPhone, key).toString(CryptoJS.enc.Utf8);
    }
});
