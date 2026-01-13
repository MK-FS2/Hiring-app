/* eslint-disable @typescript-eslint/no-unsafe-return */
import {InterviewRecordRepository} from '@Models/Statistics/InterviewStatistics';
import {Injectable} from '@nestjs/common';
import {Types} from 'mongoose';
import { OptionalInterval } from '../dto';

@Injectable()
export class InterviewReportService 
{
constructor(private readonly interviewRecordRepository:InterviewRecordRepository){}

async InterviewSuccessRate(companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
const data = await this.interviewRecordRepository.InterviewSuccessRate(companyId,optionalInterval)
return data
}

async AverageInterviewDuration(companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
const data = await this.interviewRecordRepository.AverageInterviewDuration(companyId,optionalInterval)
return data
}

async InterviewConversionFunnel(companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
const data = await this.interviewRecordRepository.InterviewConversionFunnel(companyId,optionalInterval)
return data
}

async InterviewTrends(companyId:Types.ObjectId,monthsBack?:number,optionalInterval?:OptionalInterval)
{
const data = await this.interviewRecordRepository.InterviewTrends(companyId,monthsBack,optionalInterval)
return data
}

async InterviewPerformanceByJob(companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
const data = await this.interviewRecordRepository.InterviewPerformanceByJob(companyId,optionalInterval)
return data
}

}