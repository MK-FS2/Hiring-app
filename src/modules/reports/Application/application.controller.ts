/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FullGuard, RolesAllowed, UserData } from '@Shared/Decorators';
import { Body,Controller,Get} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '@Shared/Enums';
import { ApplicationReportService } from './applicationReports.service';
import { OptionalFilterDTO } from '../dto';


@Controller('reports')
@FullGuard(Roles.Manger)
export class ApplicationReportsController 
{
constructor(private readonly applicationReportService:ApplicationReportService) {}

@RolesAllowed(Roles.Manger)
@Get("qualityRatio")
async OverAllApplicationsQualityRatio(@Body()optionalFilterDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.OverAllApplicationsQualityRatio(companyId,optionalFilterDTO)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("averageProcessingTime")
async AverageProcessingTime(@Body()optionalFilterDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.AverageProcessingTime(companyId,optionalFilterDTO)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("successRate")
async ApplicationSuccessRate(@Body()optionalFilterDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.ApplicationSuccessRate(companyId,optionalFilterDTO)
return Data
}

@RolesAllowed(Roles.Manger)
@Get("demographics")
async ApplicationsByDemographics(@Body()optionalFilterDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.ApplicationsByDemographics(companyId,optionalFilterDTO)
return Data
}


@RolesAllowed(Roles.Manger)
@Get("topSources")
async TopApplicantSources(@Body()optionalFilterDTO:OptionalFilterDTO,@UserData("companyId")companyId:Types.ObjectId)
{
const Data = await this.applicationReportService.TopApplicantSources(companyId,optionalFilterDTO)
return Data
}

}