/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { JobPerIndustry, JopIntervalDTO, ViewsToApplicationsDTO } from './dto';
import { JopReportsService } from './jobReports.service';
import { Body, Controller, Get } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';
import { ApplicationReportService } from './applicationReports.service';


@Controller('reports')
@FullGuard(Roles.Manger)
export class ReportsController 
{
constructor(private readonly jopReportsService:JopReportsService,private readonly applicationReportService:ApplicationReportService) {}

// JobReport

@RolesAllowed(Roles.Manger)
@Get("jobInterval")
async JopInterval(@Body() jopIntervalDTO:JopIntervalDTO,@UserData("companyId")companyId:Types.ObjectId)
  {
  const {from,to} = jopIntervalDTO
  const Result = await this.jopReportsService.JopInterval(from,to,companyId)
  return Result
}

@Get("jobPerIndustry")
@RolesAllowed(Roles.Manger)
async JobPerIndustry(@Body()jobPerIndustry:JobPerIndustry,@UserData("companyId")companyId:Types.ObjectId)
{
 const Data = await this.jopReportsService.JobPerIndustry(jobPerIndustry,companyId)
 return Data
}

@Get("viewsToApplicationRatio")
@RolesAllowed(Roles.Manger)
async ViesToApplicationsRatio(@Body()viewsToApplicationsDTO:ViewsToApplicationsDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.ViewsToApplicationRation(companyId,viewsToApplicationsDTO)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("satasperIndustry")
async StatsPerIndustru (@UserData("companyId")companyId:Types.ObjectId)
{
  const Data = await this.jopReportsService.StatsPerIndustry(companyId)
  return Data
}

@RolesAllowed(Roles.Manger)
@Get("StatsPerCareerLevel")
async StatsPerCarerLevel(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.StatsPerCarerLevel(companyId)
return Data
}


// Applications Report
@RolesAllowed(Roles.Manger)
@Get("qualityApplicationRatio")
async QualityApplicationRation(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.OverAllApplicationQuality(companyId)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("averageProcessingTime")
async AvergeProcessingTime(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.AverageProcessingTime(companyId)
return Data
}

}
