import { ApplicantRepository } from '@Models/Users';
import { HRRepository } from '@Models/Users';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { BaseUserRepository, MangerRepository } from '@Models/Users';
import { MailService } from '@Shared/Utils';
import { CloudServices } from '@Shared/Utils/Cloud';
import { FolderTypes, OTPTypes } from '@Shared/Enums';
import { FileSchema } from '@Models/common';
import { ApplicantEntity, MangerEntity } from './entity';
import * as bcrypt from 'bcrypt';
import { ConfirmEmailDTO, ResetPasswordDTO } from './dto';

@Injectable()
export class AuthService 
{
constructor(private readonly baseUserRepository:BaseUserRepository,
private readonly mangerRepository:MangerRepository,private readonly mailService:MailService,
private readonly cloudServices:CloudServices,
private readonly hrRepository:HRRepository,
private readonly applicantRepository:ApplicantRepository
){}

// To be refactored into common private methods 

async SignUpManger(manger:MangerEntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File,otpcode:string)
{
    const emailExist = await this.baseUserRepository.Exist({email:manger.email})
    if(emailExist)
    {
        throw new ConflictException("Email already exist")
    }
    const phoneExist = await this.baseUserRepository.Exist({phoneNumber:manger.phoneNumber})
    if(phoneExist)
    {
        throw new ConflictException("Phone number already exist")
    }
    
    const result = await this.mangerRepository.CreatDocument(manger)
    if(!result)
    {
        throw new InternalServerErrorException("Error creating")
    }
    const folder = `${FolderTypes.App}/${FolderTypes.Users}/${result._id.toString()}/${FolderTypes.Photos}`
    let cover:FileSchema|null = null 
    let profile:FileSchema|null = null
    if(coverimage)
    {
      cover = await this.cloudServices.uploadOne(coverimage.path,folder)
      if(!cover)
      {
        await this.mangerRepository.DeleteOne({_id:result._id})
        throw new InternalServerErrorException(`Error uploading image ${coverimage.path}`)
      }
    }
    profile = await this.cloudServices.uploadOne(profilePic.path,folder)
    if(!profile)
    {
     await this.mangerRepository.DeleteOne({_id:result._id})
     await this.cloudServices.deleteFolder(folder)
    throw new InternalServerErrorException("Error uploading image")
    }

    if(coverimage)
    {
     const update = await this.mangerRepository.UpdateOne({_id:result._id},{$set:{coverPic:cover,profilePic:profile}})
     if(!update)
     {
      await this.mangerRepository.DeleteOne({_id:result._id})
      await this.cloudServices.deleteFolder(folder)
      throw new InternalServerErrorException("Error creating")
     }
    }
    
    const emailResult = await this.mailService.sendMail(manger.email,otpcode,new Date(Date.now()+10*60*1000))
    if(!emailResult)
    {
    throw new InternalServerErrorException("Email not sent")
    }
    return result
}

// async SignUpHR(hr:HREntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File)
// {
//   const emailExist = await this.baseUserRepository.Exist({email:hr.email})
//   if(emailExist){throw new ConflictException("Email already exist")}
//   const phoneExist = await this.baseUserRepository.Exist({phoneNumber:hr.phoneNumber})
//   if(phoneExist){throw new ConflictException("Phone number already exist")}
   
//   const CompanyExist = await this.companyRepository.Exist({_id:hr.companyId})
//   if(!CompanyExist)throw new NotFoundException("No company found")

    
//     const result = await this.hrRepository.CreatDocument(hr)
//     if(!result)
//     {
//         throw new InternalServerErrorException("Error creating")
//     }
//     const folder = `${FolderTypes.App}/${FolderTypes.Users}/${result._id.toString()}/${FolderTypes.Photos}`
//     let cover:FileSchema|null = null 
//     let profile:FileSchema|null = null
//     if(coverimage)
//     {
//       cover = await this.cloudServices.uploadOne(coverimage.path,folder)
//       if(!cover)
//       {
//         await this.mangerRepository.DeleteOne({_id:result._id})
//         throw new InternalServerErrorException(`Error uploading image ${coverimage.path}`)
//       }
//     }
//     profile = await this.cloudServices.uploadOne(profilePic.path,folder)
//     if(!profile)
//     {
//      await this.mangerRepository.DeleteOne({_id:result._id})
//      await this.cloudServices.deleteFolder(folder)
//     throw new InternalServerErrorException("Error uploading image")
//     }

//     if(coverimage)
//     {
//      const update = await this.mangerRepository.UpdateOne({_id:result._id},{$set:{coverPic:cover,profilePic:profile}})
//      if(!update)
//      {
//       await this.mangerRepository.DeleteOne({_id:result._id})
//       await this.cloudServices.deleteFolder(folder)
//       throw new InternalServerErrorException("Error creating")
//      }
//     }
    
//     const emailResult = await this.mailService.sendMail(hr.email,hr.OTP[0].OTP,new Date(Date.now()+10*60*1000))
//     if(!emailResult)
//     {
//     throw new InternalServerErrorException("Email not sent")
//     }
//     return result
// }

async ConfirmEmail(confirmEmailDTO: ConfirmEmailDTO) 
{
  const userExist = await this.baseUserRepository.FindOne({ email: confirmEmailDTO.email },{ email:1, OTP: 1});

  if (!userExist) {
    throw new BadRequestException("Invalid email");
  }

  if (!userExist.OTP || userExist.OTP.length === 0) {
    throw new BadRequestException("No OTP found");
  }

  let otpMatch = false;
  let otpExpiresAt: Date = new Date();

  for (const obj of userExist.OTP) 
    {
    if (bcrypt.compareSync(confirmEmailDTO.OTP, obj.OTP) && obj.OTPtype == OTPTypes.ConfirmEmail) 
    {
      otpMatch = true;
      otpExpiresAt = new Date(obj.ExpiresAt);
      break;
    }
  }

  if (!otpMatch) 
  {
    throw new BadRequestException("Invalid OTP");
  }

  if (new Date() > otpExpiresAt) 
  {
    throw new BadRequestException("OTP timed out");
  }

   await this.baseUserRepository.UpdateOne({email:confirmEmailDTO.email},{$pull:{OTP:{ExpiresAt:otpExpiresAt}},$set:{isVerified:true}})

  return true;
}

async ResendOTP(email: string, flag: OTPTypes, otpcode: string) 
{
  console.log(email)
  const userExist = await this.baseUserRepository.FindOne({ email });
  if (!userExist) {
    throw new BadRequestException("Invalid email");
  }

  const OTP = 
  {
    OTP: bcrypt.hashSync(otpcode, 10),
    OTPtype: flag,
    ExpiresAt: new Date(Date.now() + 10 * 60 * 1000), 
  };

  const emailResult = await this.mailService.sendMail(email, otpcode, OTP.ExpiresAt);
  if (!emailResult) throw new InternalServerErrorException("Error sending OTP");

  await this.baseUserRepository.UpdateOne({ email},{$pull:{OTP:{OTPtype:flag}}}) 
  const  updateResult = await this.baseUserRepository.UpdateOne({email},{$push:{OTP}});

  if (!updateResult) throw new InternalServerErrorException("Error updating OTP");

  return true;
}
// security risk observed,credintial time is behind by 1 hour due to day light saving
async ResetPassword(resetPasswordDTO:ResetPasswordDTO)
{
const userExist = await this.baseUserRepository.FindOne({email:resetPasswordDTO.email},{OTP:1})
if(!userExist)
{
  throw new BadRequestException("Invalied email")
}
let otpMatch:boolean = false;
let otpExpiresAt: Date = new Date();



if (!userExist.OTP || userExist.OTP.length === 0) 
{
throw new BadRequestException("No OTP found");
}

for (const obj of userExist.OTP) 
{
  if (bcrypt.compareSync(resetPasswordDTO.OTP, obj.OTP) && obj.OTPtype == OTPTypes.ForgetPassword) 
  {
      otpMatch = true;
      otpExpiresAt = new Date(obj.ExpiresAt);
      break;
  }
  }

  if (!otpMatch) 
  {
    throw new BadRequestException("Invalid OTP");
  }

  if (new Date() > otpExpiresAt) 
  {
    throw new BadRequestException("OTP timed out");
  }

  const updatingResult = await this.baseUserRepository.UpdateOne({email:resetPasswordDTO.email},{$set:{changedCredentialsAt:new Date(Date.now()),password:resetPasswordDTO.password}})
  if(!updatingResult)
  {
    throw new InternalServerErrorException()
  }
  await this.baseUserRepository.UpdateOne({email:resetPasswordDTO.email},{$pull:{OTP:{OTPtype:OTPTypes.ForgetPassword}}})
return true

}

async SignUpApplicant(applicant:ApplicantEntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File,otpcode:string)
{
    const emailExist = await this.baseUserRepository.Exist({email:applicant.email})
    if(emailExist)
    {
        throw new ConflictException("Email already exist")
    }
    const phoneExist = await this.baseUserRepository.Exist({phoneNumber:applicant.phoneNumber})
    if(phoneExist)
    {
        throw new ConflictException("Phone number already exist")
    }
    
    const result = await this.applicantRepository.CreatDocument(applicant)
    if(!result)
    {
        throw new InternalServerErrorException("Error creating")
    }
    const folder = `${FolderTypes.App}/${FolderTypes.Users}/${result._id.toString()}/${FolderTypes.Photos}`
    let cover:FileSchema|null = null 
    let profile:FileSchema|null = null
    if(coverimage)
    {
      cover = await this.cloudServices.uploadOne(coverimage.path,folder)
      if(!cover)
      {
        await this.applicantRepository.DeleteOne({_id:result._id})
        throw new InternalServerErrorException(`Error uploading image ${coverimage.path}`)
      }
    }
    profile = await this.cloudServices.uploadOne(profilePic.path,folder)
    if(!profile)
    {
     await this.applicantRepository.DeleteOne({_id:result._id})
     await this.cloudServices.deleteFolder(folder)
    throw new InternalServerErrorException("Error uploading image")
    }

    if(coverimage)
    {
     const update = await this.applicantRepository.UpdateOne({_id:result._id},{$set:{coverPic:cover,profilePic:profile}})
     if(!update)
     {
      await this.applicantRepository.DeleteOne({_id:result._id})
      await this.cloudServices.deleteFolder(folder)
      throw new InternalServerErrorException("Error creating")
     }
    }
    
    const emailResult = await this.mailService.sendMail(applicant.email,otpcode,new Date(Date.now()+10*60*1000))
    if(!emailResult)
    {
    throw new InternalServerErrorException("Email not sent")
    }
    return result
}



}
