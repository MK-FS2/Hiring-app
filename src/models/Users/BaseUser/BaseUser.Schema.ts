import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Genders, OTPTypes, UserAgent } from "@Shared/Enums";
import { EmailRegex} from "@Shared/Validations";
import { Types } from "mongoose";
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js";
import { InternalServerErrorException } from "@nestjs/common";
import dotenv from "dotenv"
dotenv.config()


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

const key = process.env.Encryptionkey!;
if (!key) throw new InternalServerErrorException("EncryptionKey is missing in env");

UserSchema.pre('save',async function() 
{
  if (this.password) 
  {
  this.password = await bcrypt.hash(this.password,10);
  }
    
  if (this.phoneNumber) 
  {
    this.phoneNumber = CryptoJS.AES.encrypt(this.phoneNumber, key).toString();
  }
});

UserSchema.post("find", function(docs:User[]) 
{
    for (const doc of docs) 
    {
      if (doc.phoneNumber) 
       {
        doc.phoneNumber = CryptoJS.AES.decrypt(doc.phoneNumber,key).toString(CryptoJS.enc.Utf8);
       }
    }
});

UserSchema.post("find",function(doc:User) 
{
   if (doc.phoneNumber) 
   {
    doc.phoneNumber = CryptoJS.AES.decrypt(doc.phoneNumber,key).toString(CryptoJS.enc.Utf8);
   }
});


UserSchema.virtual("userName").get(function(this:User)
{
  return this.firstName+"-"+this.lastName
})

UserSchema.post('find', function (docs: User[]) 
{
  for (const doc of docs) 
  {
    if (!doc.phoneNumber) continue;

    doc.phoneNumber = CryptoJS.AES.decrypt(doc.phoneNumber,key).toString(CryptoJS.enc.Utf8);
  }
});

UserSchema.post('findOne', function (doc: User) 
{
  if (!doc || !doc.phoneNumber) return;
  doc.phoneNumber = CryptoJS.AES.decrypt(doc.phoneNumber,key).toString(CryptoJS.enc.Utf8);
})