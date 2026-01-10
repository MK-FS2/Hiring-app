/* eslint-disable @typescript-eslint/no-unsafe-return */
import {JobRecordRepository} from '@Models/Statistics/JobStatistics';
import {Injectable} from '@nestjs/common';
import {Types} from 'mongoose';
import { JobPerIndustry, ViewsToApplicationsDTO } from './dto';

@Injectable()
export class JopReportsService 
{
constructor(private readonly jobRecordRepository:JobRecordRepository){}

async JopInterval(from:Date,to:Date,companyId:Types.ObjectId)
{
const jobs = await this.jobRecordRepository.JobsCreatedInterval(from,to,companyId)
if (!jobs) return "No jobs found in that period"
return jobs
}

async JobPerIndustry(jobPerIndustry:JobPerIndustry,companyId:Types.ObjectId)
{
const {from,to,industry} = jobPerIndustry

const jobs = await this.jobRecordRepository.JobPerIndustry(companyId,from,to,industry)
if (!jobs) return "No jobs found in that period"
return jobs
}

async ViewsToApplicationRation(companyId:Types.ObjectId,viewsToApplications:ViewsToApplicationsDTO)
{
 const data = this.jobRecordRepository.ViewsToAppliesRatio(companyId,viewsToApplications)
 return data 
}

async StatsPerIndustry(companyId:Types.ObjectId)
{
const jobs = await this.jobRecordRepository.StatsPerIndustry(companyId)
return jobs
}

async StatsPerCarerLevel(companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.StatsPerCarerLevel(companyId)
return data
}

async JobEngagementMetrics(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.JobEngagementMetrics(jobId,companyId)
return data
}

async JobPerformanceScore(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.JobPerformanceScore(jobId,companyId)
return data
}

async JobWorkplaceTypeComparison(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.JobWorkplaceTypeComparison(jobId,companyId)
return data
}

async JobTimeSeries(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.JobTimeSeries(jobId,companyId)
return data
}

async JobIndustryRanking(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.JobIndustryRanking(jobId,companyId)
return data
}

async OverallHiringFunnel(companyId:Types.ObjectId,from?:Date,to?:Date)
{
const data = await this.jobRecordRepository.OverallHiringFunnel(companyId,from,to)
return data
}

async TopPerformingJobs(companyId:Types.ObjectId,limit?:number)
{
const data = await this.jobRecordRepository.TopPerformingJobs(companyId,limit)
return data
}

async WorkplaceTypeDistribution(companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.WorkplaceTypeDistribution(companyId)
return data
}


async CareerLevelPerformance(companyId:Types.ObjectId)
{
const data = await this.jobRecordRepository.CareerLevelPerformance(companyId)
return data
}

}