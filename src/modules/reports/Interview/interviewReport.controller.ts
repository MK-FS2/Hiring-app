/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { OptionalInterval } from '../dto';
import { Body, Controller, Get, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';
import { InterviewReportService } from './interviewReport.service';



@Controller('reports')
@FullGuard(Roles.Manger)
export class InterviewReportsController 
{
constructor(private readonly interviewReportService:InterviewReportService) {}

@RolesAllowed(Roles.Manger)
@Get("successRate")
async InterviewSuccessRate(@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.interviewReportService.InterviewSuccessRate(companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("averageDuration")
async AverageInterviewDuration(@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.interviewReportService.AverageInterviewDuration(companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("conversionFunnel")
async InterviewConversionFunnel(@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.interviewReportService.InterviewConversionFunnel(companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("trends")
async InterviewTrends(@Query("monthsBack")monthsBack:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const monthsBackNumber = monthsBack ? parseInt(monthsBack) : 12
const Data = await this.interviewReportService.InterviewTrends(companyId,monthsBackNumber,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("performanceByJob")
async InterviewPerformanceByJob(@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.interviewReportService.InterviewPerformanceByJob(companyId,optionalInterval)
return Data
}

}