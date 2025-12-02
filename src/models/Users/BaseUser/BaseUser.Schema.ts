/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Genders, OTPTypes, UserAgent } from "@Shared/Enums";
import { EmailRegex} from "@Shared/Validations";
import { Types } from "mongoose";
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js";

@Schema({timestamps:false})
export class OTPSchema 
{   @Prop({type:String,required:true})
    OTP:string
    @Prop({type:String,enum:OTPTypes,required:true})
    OTPtype:OTPTypes
    @Prop({type:Date,required:true})
    ExpiresAt:Date
}


@Schema({timestamps:{createdAt:true},toJSON:{virtuals:true},toObject:{virtuals:true},discriminatorKey:"Role"})
export class User
{
readonly Role?:string
readonly _id?:Types.ObjectId

@Prop({type:String,required:true,minLength:[2,"minimum of 2 characters"],maxLength:[20,"maximumm of 20 characters"]})
firstName:string

@Prop({type:String,required:true,minLength:[2,"minimum of 2 characters"],maxLength:[20,"maximumm of 20 characters"]})
lastName:string

@Prop({type:String,required:true,match:[EmailRegex,"Invalid email format"],unique:true})
email:string

@Prop({ type: String, required:function(this: User) { return this.provider === UserAgent.System; } })
phoneNumber?:string

@Prop({ type: String, required:function(this: User) { return this.provider === UserAgent.System; } })
password?:string

@Prop({ type: String, required:function(this: User) { return this.provider === UserAgent.System; } })
gender?:Genders

@Prop({type:String,enum:UserAgent,required:true})
provider:UserAgent

@Prop({type: Date,required: function(this: User) { return this.provider === UserAgent.System; },
  validate: 
  {
    validator: (value: Date) => value <= new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
    message: 'User must be at least 18 years old.',
  },
})
dateofbirth?: Date;

@Prop({type:Boolean,required:false,default:false})
isVerified?:boolean

@Prop({type: Date,required: false,validate: 
    {
    validator: (value: Date) => 
    {
      return new Date(value) <= new Date();
    },
    message: 'Date cannot be in the future',
  },
})
deletedAt?:Date

@Prop({type:Boolean,required:false,default:false})
isBanned?:boolean 

@Prop({type:Date,required:function(this:User)
{
    if(this.isBanned && this.isBanned == true)
    {
        return true
    } 
    else 
    {
      return false  
    }
}})
bannedAt?:Date

@Prop({type:FileSchema,required:false})
coverPic?:FileSchema

@Prop({type:FileSchema,required:false})
profilePic?:FileSchema

@Prop({type:Date,required:false,default:new Date(Date.now())})
changedCredentialsAt?: Date;

@Prop({type:[OTPSchema],required:false,default:[]})
OTP?:OTPSchema[]
}

export const UserSchema = SchemaFactory.createForClass(User)

const key = process.env.EncryptionKey!;
const IV = process.env.IV!
const iv = CryptoJS.enc.Utf8.parse(IV); 

UserSchema.pre('save', async function () 
{
  if (this.isModified('password') && this.password) 
  {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified('email') && this.email) 
  {
    this.email = CryptoJS.AES.encrypt(this.email, CryptoJS.enc.Utf8.parse(key), { iv }).toString();
  }

  if (this.isModified('phoneNumber') && this.phoneNumber) 
  {
    this.phoneNumber = CryptoJS.AES.encrypt(this.phoneNumber, CryptoJS.enc.Utf8.parse(key), { iv }).toString();
  }
});

UserSchema.pre('findOne', function () 
{
  const query: any = this.getQuery();

  if (query.email) {
    query.email = CryptoJS.AES.encrypt(String(query.email), CryptoJS.enc.Utf8.parse(key), { iv }).toString();
  }

  if (query.phoneNumber) 
  {
    query.phoneNumber = CryptoJS.AES.encrypt(String(query.phoneNumber), CryptoJS.enc.Utf8.parse(key), { iv }).toString();
  }

  this.setQuery(query);
});

// Decrypt helper
function decryptFields(doc: any) 
{
  if (!doc) return;
  if (doc.email) 
  {
    doc.email = CryptoJS.AES.decrypt(doc.email, CryptoJS.enc.Utf8.parse(key), { iv }).toString(CryptoJS.enc.Utf8);
  }
  if (doc.phoneNumber) 
  {
    doc.phoneNumber = CryptoJS.AES.decrypt(doc.phoneNumber, CryptoJS.enc.Utf8.parse(key), { iv }).toString(CryptoJS.enc.Utf8);
  }
}

UserSchema.post('findOne', function (result) 
{
  decryptFields(result);
});

UserSchema.post('find', function (results: any[]) 
{
  results.forEach(decryptFields);
});