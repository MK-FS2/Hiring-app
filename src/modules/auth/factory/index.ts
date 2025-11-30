import { Injectable } from "@nestjs/common";
import { MangerDTO } from "../dto";
import { MangerEntity } from "../entity/manger.entity";
import { OTPTypes, UserAgent } from "@Shared/Enums";
import {nanoid} from "nanoid"

@Injectable()
export class AuthFactory 
{

    CreateManger(mangerDTO:MangerDTO)
    {
     const manger = new MangerEntity()
     manger.firstName = mangerDTO.firstName
     manger.lastName = mangerDTO.lastName
     manger.email = mangerDTO.email
     manger.password = mangerDTO.password
     manger.phoneNumber = mangerDTO.phoneNumber
     manger.gender = mangerDTO.gender
     manger.dateofbirth = mangerDTO.dateofbirth
     manger.provider = UserAgent.System
     manger.OTP=[{OTP:nanoid(5),OTPtype: OTPTypes.ConfirmEmail,ExpiresAt: new Date(Date.now()+10*60*1000)}];
     return manger
    }



}