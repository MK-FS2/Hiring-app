import { FileSchema } from "@Models/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Genders, OTPTypes, UserAgent } from "@Shared/Enums";
import { EmailRegex} from "@Shared/Validations";
import { Types } from "mongoose";

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

@Prop({type:String,required:true})
phoneNumber:string

@Prop({type:String,required:function(this:User)
{
 if(this.provider == UserAgent.Google)
 {
    return false
 }
 else 
 {
    return true
 }
}
})
password:string

@Prop({type:String,enum:Genders,required:true})
gender:Genders

@Prop({type:String,enum:UserAgent,required:true})
provider:UserAgent

@Prop({type: Date,required: true,validate: 
  {
    validator: function (value: Date) 
    {
      const today = new Date();
      const adultDate = new Date(today.getFullYear()-18,today.getMonth(),today.getDate());
      return value <= adultDate;
    },
    message: 'User must be at least 18 years old.',
  },
})
dateofbirth:Date

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

@Prop({type:Date,required:false})
changedCredentialsAt?: Date;

@Prop({type:[OTPSchema],required:false})
OTP?:OTPSchema[]
}

export const UserSchema = SchemaFactory.createForClass(User)