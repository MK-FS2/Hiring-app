/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { JobPerIndustry, JopIntervalDTO, ViewsToApplicationsDTO } from './dto';
import { JopReportsService } from './jobReports.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';


@Controller('reports')
@FullGuard(Roles.Manger)
export class ReportsController 
{
constructor(private readonly JopReportsService:JopReportsService) {}

@RolesAllowed(Roles.Manger)
@Get("jobInterval")
async JopInterval(@Body() jopIntervalDTO:JopIntervalDTO,@UserData("companyId")companyId:Types.ObjectId)
  {
  const {from,to} = jopIntervalDTO
  const Result = await this.JopReportsService.JopInterval(from,to,companyId)
  return Result
}

@Get("jobPerIndustry")
@RolesAllowed(Roles.Manger)
async JobPerIndustry(@Body()jobPerIndustry:JobPerIndustry,@UserData("companyId")companyId:Types.ObjectId)
{
 const Data = await this.JopReportsService.JobPerIndustry(jobPerIndustry,companyId)
 return Data
}

@Get("viewsToApplicationRatio")
@RolesAllowed(Roles.Manger)
async ViesToApplicationsRatio(@Body()viewsToApplicationsDTO:ViewsToApplicationsDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.JopReportsService.ViewsToApplicationRation(companyId,viewsToApplicationsDTO)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("satasperIndustry")
async StatsPerIndustru (@UserData("companyId")companyId:Types.ObjectId)
{
  const Data = await this.JopReportsService.StatsPerIndustry(companyId)
  return Data
}

@RolesAllowed(Roles.Manger)
@Get("StatsPerCareerLevel")
async StatsPerCarerLevel(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.JopReportsService.StatsPerCarerLevel(companyId)
return Data
}

}
