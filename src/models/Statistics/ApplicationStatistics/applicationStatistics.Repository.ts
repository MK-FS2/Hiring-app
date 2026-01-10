/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { ApplicationRecord } from './applicationSatristics.schema';
import { ApplicationRecordEntity } from '@modules/applicant';







@Injectable()
export class ApplicationRecordRepository extends AbstractRepository<ApplicationRecord> 
{
  constructor(@InjectModel(ApplicationRecord.name)private readonly applicationRecordModel:Model<ApplicationRecord>) 
  {
    super(applicationRecordModel);
  }

 async AddRecord(applicationRecordEntity:ApplicationRecordEntity)
 {
  const result = await this.CreatDocument(applicationRecordEntity)
  return result
 }


async OverAllApplicationsQualityRatio(companyId:Types.ObjectId) 
{

  const result = await this.applicationRecordModel.aggregate(
  [
   {$match:{companyId}},
   { 
    $lookup: 
    {
        from: "jobrecords",
        localField: "jobId",
        foreignField: "jobId",
        as: "jobRecords"
    }
  },
  {$unwind:"$jobRecords"},
  { 
    $group:
    {
        _id: null,
        TotalQualityApplications: 
        {
            $sum: 
            {
                $cond: 
                [
                    { 
                        $and: 
                        [
                            { $eq: ["$jobRecords.jobIndustry", "$applicantIndustry"] },
                            { $eq: ["$jobRecords.requiredCarerLevel", "$applicantCarerLevel"] }
                        ]
                    },
                    1,
                    0
                ]
            }
        },
        TotalApplications: { $sum: "$jobRecords.applications" }
    }},
    { 
      $project: 
      {
        _id: 0,
        Ratio: 
        {
            $cond: 
            [
             {$eq:["$TotalApplications",0]},
              0,
             {$multiply:
              [
                {$divide:["$TotalQualityApplications", "$TotalApplications"]},
                100
              ]}
            ]
        },
        TotalQualityApplications: 1,
        TotalApplications: 1
    }}
  ]);

  const stats = result[0] ?? 
  {
    Ratio: 0,
    TotalQualityApplications: 0,
    TotalApplications: 0
  };

  return stats;
}


async AverageProcessingTime(companyId: Types.ObjectId) {
  const result = await this.applicationRecordModel.aggregate([
    { $match: { companyId } },
    {
      $project: {
        processingTimeInMs: { $subtract: ["$processedAt", "$appliedAt"] }
      }
    },
    {
      $group: 
      {
        _id: null,
        averageTimeInMs: { $avg: "$processingTimeInMs" }
      }
    }
  ]);

  if (result.length > 0) 
    {
    const avgMs = result[0].averageTimeInMs;
    const avgHours = avgMs / (1000 * 60 * 60);
    return {
      averageTimeInHours: avgHours.toFixed(2),
    };
  }

  return {
    averageTimeInHours: 0,
  };
}


}
