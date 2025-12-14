import { Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MangerService } from './manger.service';
import { FullGuard, UserData } from '@Shared/Decorators';
import { Roles } from '@Shared/Enums';
import { CodeDTO, PermissionsDTO, ReviewJobDTO } from './dto';
import { Types } from 'mongoose';
import { ApprovedCompanyGuard, IsEmployeeGuard} from '@Shared/Guards';
import { RevokePermissionDTO } from './dto/revokepermission.dto';
import { ValidMongoID } from '@Shared/Pipes';




@UseGuards(ApprovedCompanyGuard,IsEmployeeGuard)
@FullGuard(Roles.Manger)
@Controller('manger')
export class MangerController 
{
constructor(private readonly mangerService: MangerService) {}

@Post("sendSignUpcode")
async GenerateSignUpCode(@Body()codeDTO:CodeDTO,@UserData("_id")userID:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId)
{
if(!companyId)
{
  throw new ConflictException("Create a company first")
}

const Result = await this.mangerService.GenerateSignUpCode(codeDTO,userID,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"code sent succsessfully"}
}

@Get("AllPermtions")
DisplayAllPermtions()
{
const Data = this.mangerService.DisplayAllPermtions()
return Data
}

@Put("grantPermissions")
async GrantPermissions(@Body()permissionsDTO:PermissionsDTO,@UserData("companyId")companyId:Types.ObjectId,)
{
const Result =  await this.mangerService.GrantPermtions(permissionsDTO,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"succsessfully granted"}
}


@Put("revokePermission")
async RevokePermission(@Body()permissionDTO:RevokePermissionDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Result = await this.mangerService.RevokePermtions(permissionDTO,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"succsessfully revoked"}
}


@Delete("deleteHr/:hrId")
async DeleteHR(@Param("hrId",ValidMongoID)hrId:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId)
{
const Result = await this.mangerService.DeleteHR(hrId,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Hr deleted succsessfully"}
}


@Put("reviewPostedJob/:jobId")
async ReviewPostedJob(@Body()reviewJobDTO:ReviewJobDTO,@UserData("companyId")companyId:Types.ObjectId,@Param("jobId",ValidMongoID)jobId:Types.ObjectId)
{
const Result = await this.mangerService.ReviewPostedJob(reviewJobDTO,companyId,jobId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Reviewed successfully"}
}
}
