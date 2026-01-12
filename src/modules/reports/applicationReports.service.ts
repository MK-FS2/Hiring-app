/* eslint-disable @typescript-eslint/no-unsafe-return */
import {ApplicationRecordRepository} from '@Models/Statistics/ApplicationStatistics';
import {Injectable} from '@nestjs/common';
import {Types} from 'mongoose';
import { OptionalFilterDTO } from './dto';

@Injectable()
export class ApplicationReportService 
{
constructor(private readonly applicationRecordRepository:ApplicationRecordRepository){}

async OverAllApplicationsQualityRatio(companyId:Types.ObjectId,optionalFilterDTO:OptionalFilterDTO)
{
const data = await this.applicationRecordRepository.OverAllApplicationsQualityRatio(companyId,optionalFilterDTO)
return data
}

async AverageProcessingTime(companyId:Types.ObjectId,optionalFilterDTO:OptionalFilterDTO)
{
const data = await this.applicationRecordRepository.AverageProcessingTime(companyId,optionalFilterDTO)
return data
}

async ApplicationSuccessRate(companyId:Types.ObjectId,optionalFilterDTO:OptionalFilterDTO)
{
const data = await this.applicationRecordRepository.ApplicationSuccessRate(companyId,optionalFilterDTO)
return data
}

async ApplicationsByDemographics(companyId:Types.ObjectId,optionalFilterDTO:OptionalFilterDTO)
{
const data = await this.applicationRecordRepository.ApplicationsByDemographics(companyId,optionalFilterDTO)
return data
}


async TopApplicantSources(companyId:Types.ObjectId,optionalFilterDTO:OptionalFilterDTO)
{
const data = await this.applicationRecordRepository.TopApplicantSources(companyId,optionalFilterDTO)
return data
}

}