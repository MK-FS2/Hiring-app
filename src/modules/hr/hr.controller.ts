import { HRFactory } from './factory/index';
import {Body, Controller,InternalServerErrorException,Post,UseGuards} from '@nestjs/common';
import {HrService} from './hr.service';
import {FullGuard, SetPermissions, UserData} from '@Shared/Decorators';
import {ApprovedCompanyGuard,HRPermissionGuard, IsEmployeeGuard } from '@Shared/Guards';
import {HRPermissions, Roles} from '@Shared/Enums';
import { AddJobDTO } from './dto';
import { Types } from 'mongoose';


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

}
