import { MailService } from '@Shared/Utils';
import { Types } from 'mongoose';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '@Models/Company';
import { CodeDTO } from './dto';
import { nanoid } from 'nanoid';

@Injectable()
export class MangerService 
{

constructor(private readonly companyRepository:CompanyRepository,private readonly mailService:MailService){}

async GenerateSignUpCode(codeDTO:CodeDTO,userId:Types.ObjectId,companyId:Types.ObjectId)
{
 const {hrEmail} = codeDTO

const compamyExist = await this.companyRepository.FindOne({_id:companyId,createdby:userId})
if(!compamyExist)
{
throw new NotFoundException("No comoany found")
}

const code = nanoid(5)

const addingResult = await this.companyRepository.UpdateOne({_id:companyId,createdby:userId},{$push:{companycodes:{code}}})
if(!addingResult)
{
    throw new InternalServerErrorException("Adding error")
}

const sendingResult = await this.mailService.sendMail(hrEmail,code,new Date(Date.now()+24*60*60*1000))
if(!sendingResult)
{
    await this.companyRepository.UpdateOne({_id:companyId,createdby:userId},{$pull:{companycodes:{code:code,directedTo:hrEmail}}})
    throw new InternalServerErrorException("Error sending")
}
return true
}



}
