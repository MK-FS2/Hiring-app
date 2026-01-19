/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, DefaultValuePipe,Get,InternalServerErrorException,Param,ParseIntPipe,Post,Query,UseGuards} from '@nestjs/common';
import {AdminService} from './admin.service';
import {AdminGuard} from '@Shared/Guards/admin.guard';
import {AuthGuard} from '@Shared/Guards';
import { DecisionDTO } from './dto';
import { ValidMongoID, ValidStringPipe } from '@Shared/Pipes';
import { Types } from 'mongoose';

@Controller('admin')

export class AdminController 
{
constructor(private readonly adminService: AdminService){}

@UseGuards(AuthGuard,AdminGuard)
@Get("unapprovedCompanies")
async AllUnApprovedCompanies(@Query('page', new DefaultValuePipe(1),ParseIntPipe) page: number,@Query('limit', new DefaultValuePipe(10),ParseIntPipe)limit:number)
{
const Data = await this.adminService.CompaniesTobeConfirmed(page,limit)
return Data
}

@Get("approvedCompanies")
async AllApprovedCompanies(@Query('page',new DefaultValuePipe(1),ParseIntPipe)page:number,@Query('limit',new DefaultValuePipe(10),ParseIntPipe)limit:number)
{
const Data = await this.adminService.AllAppovedComapnies(page,limit)
return Data
}

@Post("approvalDecision/:companyId")
async ApprovalDecision(@Body()decisionDTO:DecisionDTO,@Param("companyId",ValidMongoID)companyId:Types.ObjectId)
{
const Result = await this.adminService.ApprovalDecision(decisionDTO,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Decision made succsessfully"}
}

@Get("bannedCompanies")
async BannedCompanies(@Query("page",new DefaultValuePipe(1),ParseIntPipe)page:number,@Query("limit",new DefaultValuePipe(10),ParseIntPipe)limit:number,@Query("companyName",new ValidStringPipe(0,10))companyName?:string)
{
    const Data = await this.adminService.AllBannedComapies(page,limit,companyName)
    return Data
}

@Post("UnbannedCompany/:companyId")
async UnBannedCompany(@Param("companyId",ValidMongoID)companyId:Types.ObjectId)
{
const Result = await this.adminService.UnBannedACompany(companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Unbanned succsessfully"}
}

@Post("bannedACompany/:companyId")
async BannedACompany(@Param("companyId",ValidMongoID)companyId:Types.ObjectId)
{
const Result = await this.adminService.BannedACompany(companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")

return {message:"Banned succsessfully"}
}


}
