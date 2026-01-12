/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { JobPerIndustry, JopIntervalDTO,OptionalFilterDTO } from './dto';
import { JopReportsService } from './jobReports.service';
import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';
import { ApplicationReportService } from './applicationReports.service';
import { ValidMongoID } from '@Shared/Pipes';


@Controller('reports')
@FullGuard(Roles.Manger)
export class JobReportsController 
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
async ViesToApplicationsRatio(@Body()viewsToApplicationsDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
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


@RolesAllowed(Roles.Manger)
@Get("jobEngagementMetrics/:jobId")
async JobEngagementMetrics(@Param("jobId",ValidMongoID)jobId:string,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.JobEngagementMetrics(new Types.ObjectId(jobId),companyId)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("jobPerformanceScore/:jobId")
async JobPerformanceScore(@Param("jobId")jobId:string,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.JobPerformanceScore(new Types.ObjectId(jobId),companyId)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("jobWorkplaceTypeComparison/:jobId")
async JobWorkplaceTypeComparison(@Param("jobId")jobId:string,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.JobWorkplaceTypeComparison(new Types.ObjectId(jobId),companyId)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("jobTimeSeries/:jobId")
async JobTimeSeries(@Param("jobId")jobId:string,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.JobTimeSeries(new Types.ObjectId(jobId),companyId)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("jobIndustryRanking/:jobId")
async JobIndustryRanking(@Param("jobId")jobId:string,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.JobIndustryRanking(new Types.ObjectId(jobId),companyId)
return Data
}


@RolesAllowed(Roles.Manger)
@Get("overallHiringFunnel")
async OverallHiringFunnel(@Body()jopIntervalDTO:JopIntervalDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const {from,to} = jopIntervalDTO
const Data = await this.jopReportsService.OverallHiringFunnel(companyId,from,to)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("topPerformingJobs")
async TopPerformingJobs(@Query("limit")limit:string,@UserData("companyId")companyId:Types.ObjectId)
{
const limitNumber = limit ? parseInt(limit) : 10
const Data = await this.jopReportsService.TopPerformingJobs(companyId,limitNumber)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("workplaceTypeDistribution")
async WorkplaceTypeDistribution(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.WorkplaceTypeDistribution(companyId)
return Data
}


@RolesAllowed(Roles.Manger)
@Get("careerLevelPerformance")
async CareerLevelPerformance(@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.jopReportsService.CareerLevelPerformance(companyId)
return Data
}

}