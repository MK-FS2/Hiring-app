/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { HRRepository } from './../../models/Users/HR/HR.Repository';
import { MailService } from '@Shared/Utils';
import { Types } from 'mongoose';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '@Models/Company';
import { CodeDTO, PermissionsDTO } from './dto';
import { nanoid } from 'nanoid';
import { HR } from '@Models/Users';



@Injectable()
export class MangerService 
{

constructor(private readonly companyRepository:CompanyRepository,
private readonly mailService:MailService,
private readonly hrRepository:HRRepository
){}

async GenerateSignUpCode(codeDTO:CodeDTO,userId:Types.ObjectId,companyId:Types.ObjectId)
{
 const {hrEmail} = codeDTO

const compamyExist = await this.companyRepository.FindOne({_id:companyId,createdby:userId})
if(!compamyExist)
{
throw new NotFoundException("No company found")
}

const code = nanoid(5)

const addingResult = await this.companyRepository.UpdateOne({_id:companyId,createdby:userId},{$push:{companycodes:{code,directedTo:hrEmail}}})
if(!addingResult)
{
    throw new InternalServerErrorException("Adding error")
}

const sendingResult = await this.mailService.sendMail(hrEmail,code,new Date(Date.now()+24*60*60*1000))
if(!sendingResult)
{
    await this.companyRepository.UpdateOne({_id:companyId,createdby:userId},{$pull:{companycodes:{code:code}}})
    throw new InternalServerErrorException("Error sending")
}
return true
}

async GrantPermtions(permissionsDTO:PermissionsDTO,companyId:Types.ObjectId)
{
const hrExist = await this.companyRepository.FindOne({_id:companyId,Hrs: new Types.ObjectId(permissionsDTO.hrId)},{"Hrs.$":1},{populate:{path:"Hrs",select:"permissions"}});

if(!hrExist)
{
    throw new NotFoundException("No Hr found")
}

if (!hrExist.Hrs || hrExist.Hrs.length === 0) 
{
  throw new Error("HR not found");
}

const hr = hrExist.Hrs![0] as unknown as HR; const mergedPermissions = Array.from(new Set([...(hr?.permissions || []),...permissionsDTO.Permissions]));


const addingResult = await this.hrRepository.UpdateOne({_id:new Types.ObjectId(permissionsDTO.hrId)},{$set:{permissions:mergedPermissions}}) 
if(!addingResult)
{
    throw new InternalServerErrorException("Error updating")
}
return true
}


}
