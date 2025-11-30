import { Injectable } from "@nestjs/common";
import { HRDTO, MangerDTO } from "../dto";
import { OTPTypes, UserAgent } from "@Shared/Enums";
import {nanoid} from "nanoid"
import { HREntity, MangerEntity } from "../entity";


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

    CreateHR(hrDTO:HRDTO)
    {
    const hr = new HREntity()
     hr.firstName = hrDTO.firstName
     hr.lastName = hrDTO.lastName
     hr.email = hrDTO.email
     hr.password = hrDTO.password
     hr.phoneNumber = hrDTO.phoneNumber
     hr.gender = hrDTO.gender
     hr.dateofbirth = hrDTO.dateofbirth
     hr.provider = UserAgent.System
     hr.OTP=[{OTP:nanoid(5),OTPtype: OTPTypes.ConfirmEmail,ExpiresAt: new Date(Date.now()+10*60*1000)}];
     return hr
    }

}