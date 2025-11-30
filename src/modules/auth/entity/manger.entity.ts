import { OTPSchema } from "@Models/Users";
import { BaseUserEntity } from "./baseuser.entity";





export class MangerEntity extends BaseUserEntity 
{
    OTP:OTPSchema[]
}