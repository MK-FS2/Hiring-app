/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */import { HRRepository } from './../../models/Users/HR/HR.Repository';
import { MailService } from '@Shared/Utils';
import { JobRepository } from '@Models/Job';
import { Types } from 'mongoose';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException,BadGatewayException } from '@nestjs/common';
import { CompanyRepository } from '@Models/Company';
import { CodeDTO, PermissionsDTO, ReviewJobDTO } from './dto';
import { nanoid } from 'nanoid';
import { HR } from '@Models/Users';
import { RevokePermissionDTO } from './dto/revokepermission.dto';
import { CloudServices } from '@Shared/Utils/Cloud';
import { FolderTypes, JobStatus } from '@Shared/Enums';



@Injectable()
export class MangerService 
{

constructor(private readonly companyRepository:CompanyRepository,
private readonly mailService:MailService,
private readonly hrRepository:HRRepository,
private readonly cloudServices:CloudServices,
private readonly jobRepository:JobRepository
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


DisplayAllPermtions()
{
  const Permissions= 
  [
  "PostJobs",
  "EditJobs",
  "DeleteJobs",
  "ViewApplicants",
  "ManageApplicants",
  "ViewReports",
  "ManageInterviews"
];
   return Permissions
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

const hr = hrExist.Hrs![0] as unknown as HR; 
const mergedPermissions = Array.from(new Set([...(hr?.permissions || []),...permissionsDTO.Permissions]));


const addingResult = await this.hrRepository.UpdateOne({_id:new Types.ObjectId(permissionsDTO.hrId)},{$set:{permissions:mergedPermissions}}) 
if(!addingResult)
{
    throw new InternalServerErrorException("Error updating")
}
return true
}

async RevokePermtions(permissionDTO:RevokePermissionDTO,companyId:Types.ObjectId) 
{
console.log(companyId)
const hr = await this.hrRepository.FindOne({companyId:companyId,_id:permissionDTO.hrId},{permissions:1})
if(!hr)
{
    throw new NotFoundException("No Hr found")
}
const permissions = hr.permissions
if(!permissions || permissions.length ==0 || !permissions.includes(permissionDTO.permission))
{
    throw new ConflictException("There are no permtions to revoke")
}

const revokingResult = await this.hrRepository.UpdateOne({_id:permissionDTO.hrId,companyId},{$pull:{permissions:permissionDTO.permission}})
if(!revokingResult)
{
    throw new InternalServerErrorException("Error updating")
}
return true
}

async DeleteHR(hrId:Types.ObjectId,companyId:Types.ObjectId)
{
const hrExist = await this.hrRepository.FindOne({_id:hrId,companyId})
if(!hrExist)
{
    throw new NotFoundException("No Hr found")
}

const removingResult = await this.companyRepository.UpdateOne({_id:companyId},{$pull:{Hrs:hrId}})

if(!removingResult)
{
    throw new InternalServerErrorException("updating Error")
}


const deletionResult = await this.hrRepository.DeleteOne({_id:hrId,companyId})
if(!deletionResult)
{
    await this.companyRepository.UpdateOne({_id:companyId},{$push:{Hrs:hrId}})
    throw new InternalServerErrorException("Error deleting")
}

const folder = `${FolderTypes.App}/${FolderTypes.Users}/${hrExist._id.toString()}`
await this.cloudServices.deleteFolder(folder)


const html= `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
      }
      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .content {
        font-size: 14px;
        line-height: 1.6;
      }
      .footer {
        margin-top: 24px;
        font-size: 13px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">Employment Termination Notice</div>

      <div class="content">
        This notice is to inform you that your position in the company has been terminated.
        <br /><br />
        For further clarification, please contact HR.
      </div>

      <div class="footer">
        Regards,<br />
        ${hrExist.firstName}<br />
        Human Resources
      </div>
    </div>
  </body>
</html>
`;

const messageContent = `Your Postion in the company has been terminated`
await this.mailService.sendCustomMail(hrExist.email,messageContent,html)
return true
}

async ReviewPostedJob(reviewJobDTO:ReviewJobDTO,companyId:Types.ObjectId,jobId:Types.ObjectId)
{
const jobExist = await this.jobRepository.FindOne({companyId,_id:jobId})
if(!jobExist)
{
    throw new BadGatewayException("No job found")
}
if(jobExist.status == JobStatus.Open)
{
 throw new BadGatewayException("Job alredy reviewd")
}

if(reviewJobDTO.approval)
{
const result = await this.jobRepository.UpdateOne({_id:jobId,companyId},{$set:{status:JobStatus.Open,isActive:true},$unset:{mangerAlert:"",hrAlert:"",hrAlertNote:""}})
if(!result)
{
    throw new InternalServerErrorException("Error updating")
}
}
else 
{
    const result  = await this.jobRepository.UpdateOne({_id:jobId,companyId},{$set:{mangerAlert:false,hrAlert:true,hrAlertNote:reviewJobDTO.note}})
    if(!result)
{
    throw new InternalServerErrorException("Error updating")
}
}
return true
}
}
