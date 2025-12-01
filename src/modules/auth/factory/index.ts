import { ApplicantDTO } from './../dto/signups/signup_applicant.dto';
import { Injectable } from "@nestjs/common";
import { HRDTO, MangerDTO } from "../dto";
import { OTPTypes, UserAgent } from "@Shared/Enums";
import { ApplicantEntity, HREntity, MangerEntity } from "../entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthFactory 
{

    CreateManger(mangerDTO:MangerDTO,otpcode:string)
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
     manger.OTP=[{OTP:bcrypt.hashSync(otpcode,10),OTPtype: OTPTypes.ConfirmEmail,ExpiresAt: new Date(Date.now()+10*60*1000)}];
     return manger
    }

    CreateHR(hrDTO:HRDTO,otbcode:string)
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
     hr.OTP=[{OTP:bcrypt.hashSync(otbcode,10),OTPtype: OTPTypes.ConfirmEmail,ExpiresAt: new Date(Date.now()+10*60*1000)}];
     hr.companyId = hrDTO.companyId
     hr.hireDate = hrDTO.hireDate
     return hr
    }

    CreateApplicant(applicantDTO:ApplicantDTO,otbcode:string)
    {
     const applicant = new ApplicantEntity()
     applicant.firstName = applicantDTO.firstName
     applicant.lastName = applicantDTO.lastName
     applicant.email = applicantDTO.email
     applicant.password = applicantDTO.password
     applicant.phoneNumber = applicantDTO.phoneNumber
     applicant.gender = applicantDTO.gender
     applicant.dateofbirth = applicantDTO.dateofbirth
     applicant.provider = UserAgent.System
     applicant.OTP=[{OTP:bcrypt.hashSync(otbcode,10),OTPtype: OTPTypes.ConfirmEmail,ExpiresAt: new Date(Date.now()+10*60*1000)}];
     applicant.titel = applicantDTO.titel
     applicant.industry = applicantDTO.industry
     return applicant
    }

}