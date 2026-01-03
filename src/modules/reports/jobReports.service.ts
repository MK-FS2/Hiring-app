import { JobRecordRepository } from '@Models/Statistics/JobStatistics';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

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


}
