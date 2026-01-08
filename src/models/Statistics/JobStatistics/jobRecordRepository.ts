/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IndustriesFeilds } from '@Shared/Enums';
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { JobRecord } from './jobRecord.schema';
import { JobRecordEntity } from '@modules/hr';
import { ViewsToApplicationsDTO } from '@modules/reports/dto';




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

async JobsCreatedInterval(from: Date, to: Date, companyId: Types.ObjectId) 
{
  const result = await this.jobRecordModel.aggregate(
    [
    {
      $match: 
      {
        companyId,
        createdAt:{$gte:from,$lte:to}
      }
    },
    {
      $facet: 
      {
        stats: 
        [
          {
            $group:
            {
              _id: null,
              totalViews:{$sum:"$views"},
              totalSaves:{$sum:"$saves"},
              totalApplications:{$sum:"$applications"},
              totalJobs:{$sum:1}
            }
          },
          {
            $project:
            {
              _id: 0
            }
          }
        ],
        jobs: 
        [
          {
            $project: 
            {
              __v: 0,
              companyId: 0,
              jobId: 0
            }
          }
        ]
      }
    }
  ]);

  const stats = result[0]?.stats[0] ?? 
  {
    totalViews: 0,
    totalSaves: 0,
    totalApplications: 0,
    totalJobs: 0
  };

  return {
    metadata: 
    {
      ...stats,
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0]
    },
    data: result[0]?.jobs ?? []
  };
}


async JobPerIndustry(companyId:Types.ObjectId,from:Date,to:Date,industry:IndustriesFeilds) 
{
  const result = await this.jobRecordModel.aggregate([
    {
      $match: {
        companyId,
        jobIndustry: industry,
        createdAt: { $gte: from, $lte: to }
      }
    },
    {
      $facet: {
        stats: [
          {
            $group: {
              _id: null,
              totalViews: { $sum: "$views" },
              totalSaves: { $sum: "$saves" },
              totalApplications: { $sum: "$applications" },
              totalJobs: { $sum: 1 }
            }
          },
          { $project: { _id: 0 } }
        ],
        jobs: [
          { $project: { _id: 0, companyId: 0, __v: 0 } }
        ]
      }
    }
  ]);


  const stats = result[0]?.stats[0] ?? 
  {
    totalViews: 0,
    totalSaves: 0,
    totalApplications: 0,
    totalJobs: 0
  };

  return {
    metadata: {
      ...stats,
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
      industry
    },
    data: result[0]?.jobs ?? []
  };
}


async ViewsToAppliesRatio(companyId: Types.ObjectId, dto: ViewsToApplicationsDTO) {
  const { industry, from, to } = dto;

  const QueryFilter: any = { companyId };

  if (from || to) QueryFilter.createdAt = {};
  if (from) QueryFilter.createdAt.$gte = from;
  if (to) QueryFilter.createdAt.$lte = to;
  if (industry) QueryFilter.jobIndustry = industry;

  const ratioResult = await this.jobRecordModel.aggregate(
    [
    {$match:QueryFilter},
    {
      $group: 
      {
        _id: null,
        totalViews:{$sum:"$views"},
        totalApplications:{$sum:"$applications"}
      }
    },
    {
      $project: 
      {
        _id: 0,
        totalViews: 1,
        totalApplications: 1,
        ratio: 
        {
          $cond: 
          [
            {$eq:["$totalViews",0]},
            0,
            {$divide:["$totalApplications","$totalViews"]}
          ]
        }
      }
    }
  ]);

const Data = ratioResult[0]? 
   {
      totalViews: ratioResult[0].totalViews,
      totalApplications: ratioResult[0].totalApplications,
      ratio: parseFloat(ratioResult[0].ratio.toFixed(2))
    }
  : {totalViews:0,totalApplications:0,ratio:0};
 return Data
}

async StatsPerIndustry(companyId: Types.ObjectId) {
  const jobs = await this.jobRecordModel.aggregate([
    { $match: { companyId } },
    { 
      $group: 
      {
        _id:"$jobIndustry",
        totalJobs:{$sum:1},
        totalViews: {$sum:"$views"},
        totalApplications:{$sum:"$applications"}
      }
    },
    {
      $project: 
      {
        industry: "$_id",
        totalJobs: 1,
        totalViews: 1,
        totalApplications: 1,
        _id: 0
      }
    }
  ]);

  return jobs.length ? jobs : [];
}


async StatsPerCarerLevel(companyId:Types.ObjectId)
{

const jobs = await this.jobRecordModel.aggregate(
[
{$match:{companyId:companyId}},
  { 
      $group: 
      {
        _id:"$requiredCarerLevel",
        totalJobs:{$sum:1},
        totalViews: {$sum:"$views"},
        totalApplications:{$sum:"$applications"}
      }
 },
 {
   $project: 
    {
        CarerLevel:"$_id",
        totalJobs:1,
        totalViews:1,
        totalApplications:1,
        _id: 0
      }
    }
])

return jobs.length ? jobs : [];
}

}