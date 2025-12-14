import { HRFactory } from './factory/index';
import {Body, Controller,Get,InternalServerErrorException,Param,Post,Put,UseGuards} from '@nestjs/common';
import {HrService} from './hr.service';
import {FullGuard, SetPermissions, UserData} from '@Shared/Decorators';
import {ApprovedCompanyGuard,HRPermissionGuard, IsEmployeeGuard } from '@Shared/Guards';
import {HRPermissions, Roles} from '@Shared/Enums';
import { AddJobDTO, UpdateJobDTO } from './dto';
import { Types } from 'mongoose';
import { ValidMongoID } from '@Shared/Pipes';


@UseGuards(ApprovedCompanyGuard,IsEmployeeGuard,HRPermissionGuard)
@FullGuard(Roles.HR)
@Controller('hr')
export class HrController 
{
  constructor(private readonly hrService:HrService,
   private readonly hrFactory:HRFactory
  ) 
  {}

 @SetPermissions(HRPermissions.PostJobs)
 @Post("postJob")
 async PostJob(@Body()jobDTO:AddJobDTO,@UserData("companyId")companyId:Types.ObjectId,@UserData("_id")creatorId:Types.ObjectId)
 {
 const job = this.hrFactory.CreateJob(jobDTO,companyId,creatorId)
 const Result = await this.hrService.CreateJob(job)
 if(!Result) throw new InternalServerErrorException("Internal Server Error")
 return {message:"Created Successfully",status:200}
 }


@SetPermissions(HRPermissions.EditJobs)
@Put("updateJob/:jobId")
async UpdateJob(@Body()updateJobDTO:UpdateJobDTO,@UserData("_id")editorId:Types.ObjectId,@Param("jobId",ValidMongoID)jobId:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId)
{
const job = this.hrFactory.UpdateJob(updateJobDTO,editorId)
const Result = await this.hrService.UpdateJob(job,jobId,companyId)
 if(!Result) throw new InternalServerErrorException("Internal Server Error")
 return {message:"Updated Successfully",status:200}
}

@SetPermissions(HRPermissions.ViewApplicants)
@Get("pendingjobApplication/:jobId")
async GetAllpendingApplications(@Param("jobId")jobId:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.hrService.GetPendingJobApplications(jobId,companyId)
return Data
}

}
