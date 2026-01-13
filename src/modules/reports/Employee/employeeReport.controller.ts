/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { EmployeeReportService } from './employeeReports.service';
import { Body, Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';
import { OptionalInterval } from '../dto';
import { ValidMongoID } from '@Shared/Pipes';


@Controller('reports')
@FullGuard(Roles.Manger)
export class EmployeeReportsController 
{
constructor(private readonly employeeReportService:EmployeeReportService) {}

@RolesAllowed(Roles.Manger)
@Get("activitySummary/:employeeId")
async EmployeeActivitySummary(@Param("employeeId",ValidMongoID)employeeId:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.employeeReportService.EmployeeActivitySummary(new Types.ObjectId(employeeId),companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("productivity/:employeeId")
async EmployeeProductivity(@Param("employeeId",ValidMongoID)employeeId:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.employeeReportService.EmployeeProductivity(new Types.ObjectId(employeeId),companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("timeline/:employeeId")
async EmployeeActionTimeline(@Param("employeeId",ValidMongoID)employeeId:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.employeeReportService.EmployeeActionTimeline(new Types.ObjectId(employeeId),companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("performanceScore/:employeeId")
async EmployeePerformanceScore(@Param("employeeId",ValidMongoID)employeeId:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.employeeReportService.EmployeePerformanceScore(new Types.ObjectId(employeeId),companyId,optionalInterval)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("actionBreakdown/:employeeId")
async EmployeeActionTypeBreakdown(@Param("employeeId",ValidMongoID)employeeId:string,@Body()optionalInterval:OptionalInterval,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.employeeReportService.EmployeeActionTypeBreakdown(new Types.ObjectId(employeeId),companyId,optionalInterval)
return Data
}

}