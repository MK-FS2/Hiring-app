import { JobRecordEntity } from './../../../modules/hr/entity/createJobRecordEntity.dto';
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { JobRecord } from './jobRecord.schema';




@Injectable()
export class JobRecordRepository extends AbstractRepository<JobRecord> 
{
  constructor(@InjectModel(JobRecord.name) private readonly jobRecordModel:Model<JobRecord>) 
  {
    super(jobRecordModel);
  }

 async AddRecord(jobRecordEntity:JobRecordEntity)
 {
  const result = await this.CreatDocument(jobRecordEntity)
  return result
 }

async JobsCreatedInterval(from:Date,to:Date,companyId:Types.ObjectId)
{
const jobs = await this.Find({companyId,createdAt:{$gte:from,$lte:to}},{__v:0,companyId:0,jobId:0})

const Totalstats = await this.jobRecordModel.aggregate(
  [
  {
    $match: 
    {
      companyId,
      createdAt: { $gte: from, $lte: to }
    }
  },
  {
    $group: 
    {
      _id: "$companyId",
      totalViews: { $sum: "$views" },
      totalSaves: { $sum: "$saves" },
      totalApplications: { $sum:"$applications"},
      totalJobs:{$sum:1}
    }
  },
  {
    $project: 
    {
    _id:0,
    companyId:0,
    __v:0
    }
  }
]);

const metadata = Totalstats[0]

 metadata.from = from.toISOString().split("T")[0];
 metadata.to = to.toISOString().split("T")[0];

const CompleteObject = 
{
metadata:metadata,
Data:jobs 
}

return CompleteObject
}

}
