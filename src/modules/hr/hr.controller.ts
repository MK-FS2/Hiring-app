/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HRFactory } from './factory/index';
import {Body, Controller,Delete,Get,InternalServerErrorException,Param,Post,Put,Query,UseGuards} from '@nestjs/common';
import {HrService} from './hr.service';
import {FullGuard, SetPermissions, UserData} from '@Shared/Decorators';
import {ApprovedCompanyGuard,HRPermissionGuard, IsEmployeeGuard } from '@Shared/Guards';
import {HRPermissions, Roles} from '@Shared/Enums';
import { AddJobDTO, InterviewDTO, ProcessAplicationDTO, ProcessInteviewDTO, UpdateJobDTO } from './dto';
import { Types } from 'mongoose';
import { ValidMongoID } from '@Shared/Pipes';


@UseGuards(ApprovedCompanyGuard,IsEmployeeGuard,HRPermissionGuard)
@FullGuard(Roles.HR)
@Controller('hr')
export class HrController 
{
constructor(private readonly hrService:HrService,private readonly hrFactory:HRFactory){}

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

@Put("processApplication")
@SetPermissions(HRPermissions.ManageApplicants)
async ProcessAplication(@Body()ProcessAplicationDTO:ProcessAplicationDTO,@UserData("companyId")companyId:Types.ObjectId,@UserData("_id")hrId:Types.ObjectId)
{
  const Result = await this.hrService.ProcessApplicants(ProcessAplicationDTO,companyId,hrId)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:"Processed Successfully",status:200}
}

@SetPermissions(HRPermissions.ManageInterviews)
@Get("interviewEvents")
async GetAllInterview(@UserData("companyId")companyId:Types.ObjectId,@Query("page")page:number=1,@Query("limit")limit:number=10)
{
const Data = await this.hrService.GetAllInterviews(companyId,page,limit)
return Data 
}

@SetPermissions(HRPermissions.ManageInterviews)
@Get("jobInterviews/:jobId")
async GetJobInterviews(@UserData("companyId")companyId:Types.ObjectId,@Param("jobId",ValidMongoID)jobId:Types.ObjectId)
{
const Data = await this.hrService.GetJobInterviews(jobId,companyId)
return Data
}

@SetPermissions(HRPermissions.ManageInterviews)
@Post("SchdulaInterview/:interviewId")
async SchdulaInterview(@Body()interviewDTO:InterviewDTO,@UserData("companyId")companyId:Types.ObjectId,@Param("interviewId",ValidMongoID)interviewId:Types.ObjectId,@UserData("_id")hrId:Types.ObjectId)
{
  const Result = await this.hrService.ScheduleInterview(interviewId,companyId,interviewDTO,hrId)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:"Schdulaled Successfully",status:200}
}

@SetPermissions(HRPermissions.EditJobs)
@Put("toggleJobStatus/:jobId")
async ToggleJobStatus(@UserData("companyId")companyId:Types.ObjectId,@Param("jobId")jobId:Types.ObjectId)
{
const Result = await this.hrService.ToggleJobStatus(jobId,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}

@SetPermissions(HRPermissions.ManageInterviews)
@Put("processInterview/:intrviewId")
async ProcessInterview(@UserData("_id")hrId:Types.ObjectId,@Param("intrviewId",ValidMongoID)intrviewId:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId,@Body()processInteviewDTO:ProcessInteviewDTO)
{
const Result = await this.hrService.InterviewOutcome(intrviewId,companyId,hrId,processInteviewDTO.decision)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}

@SetPermissions(HRPermissions.DeleteJobs)
@Delete("deleteJob/:jobId")
async DeleteJob(@UserData("companyId")companyId:Types.ObjectId,@Param("jobId")jobId:Types.ObjectId,@UserData("_id")hrId:Types.ObjectId)
{
const Result = await this.hrService.DeleteJob(jobId,companyId,hrId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Deleted Successfully",status:200}
}

}
