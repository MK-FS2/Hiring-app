import { HRRepository } from '@Models/Users';
import { CompanyRepository } from './../../models/Company/Company.Repository';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseUserRepository, MangerRepository } from '@Models/Users';
import { MailService } from '@Shared/Utils';
import { CloudServices } from '@Shared/Utils/Cloud';
import { FolderTypes } from '@Shared/Enums';
import { FileSchema } from '@Models/common';
import { HREntity, MangerEntity } from './entity';

@Injectable()
export class AuthService 
{
constructor(private readonly baseUserRepository:BaseUserRepository,
private readonly mangerRepository:MangerRepository,private readonly mailService:MailService,
private readonly cloudServices:CloudServices,
private readonly companyRepository:CompanyRepository,
private readonly hrRepository:HRRepository
){}

// To be refactored into common private functions

async SignUpManger(manger:MangerEntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File)
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
    
    const emailResult = await this.mailService.sendMail(manger.email,manger.OTP[0].OTP,new Date(Date.now()+10*60*1000))
    if(!emailResult)
    {
    throw new InternalServerErrorException("Email not sent")
    }
    return result
}

async SignUpHR(hr:HREntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File)
{
  const emailExist = await this.baseUserRepository.Exist({email:hr.email})
  if(emailExist){throw new ConflictException("Email already exist")}
  const phoneExist = await this.baseUserRepository.Exist({phoneNumber:hr.phoneNumber})
  if(phoneExist){throw new ConflictException("Phone number already exist")}
   
  const CompanyExist = await this.companyRepository.Exist({_id:hr.companyId})
  if(!CompanyExist)throw new NotFoundException("No company found")

    
    const result = await this.hrRepository.CreatDocument(hr)
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
    
    const emailResult = await this.mailService.sendMail(hr.email,hr.OTP[0].OTP,new Date(Date.now()+10*60*1000))
    if(!emailResult)
    {
    throw new InternalServerErrorException("Email not sent")
    }
    return result
}





}
