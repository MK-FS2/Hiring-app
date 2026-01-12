/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { ApplicationRecord } from './applicationSatristics.schema';
import { ApplicationRecordEntity } from '@modules/applicant';
import {OptionalFilterDTO } from '@modules/reports/dto';

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


async OverAllApplicationsQualityRatio(companyId:Types.ObjectId, dto?:OptionalFilterDTO) 
{
  const {from, to, industry} = dto ?? {};
  
  const matchStage: any = { companyId };
  if (from || to) {
    matchStage.appliedAt = {};
    if (from) matchStage.appliedAt.$gte = from;
    if (to) matchStage.appliedAt.$lte = to;
  }
  if (industry) matchStage.applicantIndustry = industry;

  const result = await this.applicationRecordModel.aggregate(
  [
   {$match:matchStage},
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
        TotalApplications: { $sum: 1 }
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

async AverageProcessingTime(companyId: Types.ObjectId,dto:OptionalFilterDTO) {
  const {from, to, industry} = dto ?? {};
  
  const matchStage: any = { companyId, processedAt: { $exists: true } };
  if (from || to) {
    matchStage.appliedAt = {};
    if (from) matchStage.appliedAt.$gte = from;
    if (to) matchStage.appliedAt.$lte = to;
  }
  if (industry) matchStage.applicantIndustry = industry;

  const result = await this.applicationRecordModel.aggregate([
    { $match: matchStage },
    {
      $project: {
        processingTimeInMs: { $subtract: ["$processedAt", "$appliedAt"] }
      }
    },
    {
      $group: 
      {
        _id: null,
        averageTimeInMs: { $avg: "$processingTimeInMs" },
        totalApplications: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) 
  {
    const avgMs = result[0].averageTimeInMs;
    const avgHours = avgMs / (1000 * 60 * 60);
    const avgDays = avgHours / 24;
    return {
      averageTimeInHours: parseFloat(avgHours.toFixed(2)),
      averageTimeInDays: parseFloat(avgDays.toFixed(2)),
      totalProcessedApplications: result[0].totalApplications
    };
  }

  return {
    averageTimeInHours: 0,
    averageTimeInDays: 0,
    totalProcessedApplications: 0
  };
}

async ApplicationSuccessRate(companyId: Types.ObjectId, dto:OptionalFilterDTO) {
  const {from, to, industry} = dto ?? {};
  
  const matchStage: any = { companyId, applicationOutcome: { $exists: true } };
  if (from || to) {
    matchStage.appliedAt = {};
    if (from) matchStage.appliedAt.$gte = from;
    if (to) matchStage.appliedAt.$lte = to;
  }
  if (industry) matchStage.applicantIndustry = industry;

  const result = await this.applicationRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        successfulApplications: {
          $sum: { $cond: [{ $eq: ["$applicationOutcome", true] }, 1, 0] }
        },
        rejectedApplications: {
          $sum: { $cond: [{ $eq: ["$applicationOutcome", false] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalApplications: 1,
        successfulApplications: 1,
        rejectedApplications: 1,
        successRate: {
          $cond: [
            { $eq: ["$totalApplications", 0] },
            0,
            { $multiply: [{ $divide: ["$successfulApplications", "$totalApplications"] }, 100] }
          ]
        }
      }
    }
  ]);

  const stats = result[0] ?? {
    totalApplications: 0,
    successfulApplications: 0,
    rejectedApplications: 0,
    successRate: 0
  };

  return {
    ...stats,
    successRate: parseFloat(stats.successRate.toFixed(2))
  };
}

async ApplicationsByDemographics(companyId: Types.ObjectId, dto:OptionalFilterDTO) {
  const {from, to, industry} = dto ?? {};
  
  const matchStage: any = { companyId };
  if (from || to) {
    matchStage.appliedAt = {};
    if (from) matchStage.appliedAt.$gte = from;
    if (to) matchStage.appliedAt.$lte = to;
  }
  if (industry) matchStage.applicantIndustry = industry;

  const result = await this.applicationRecordModel.aggregate([
    { $match: matchStage },
    {
      $facet: {
        byGender: [
          {
            $group: {
              _id: "$applicantGender",
              count: { $sum: 1 },
              successfulCount: {
                $sum: { $cond: [{ $eq: ["$applicationOutcome", true] }, 1, 0] }
              }
            }
          },
          {
            $project: {
              _id: 0,
              gender: "$_id",
              totalApplications: "$count",
              successfulApplications: "$successfulCount",
              successRate: {
                $cond: [
                  { $eq: ["$count", 0] },
                  0,
                  { $multiply: [{ $divide: ["$successfulCount", "$count"] }, 100] }
                ]
              }
            }
          }
        ],
        byCareerLevel: [
          {
            $group: {
              _id: "$applicantCarerLevel",
              count: { $sum: 1 },
              successfulCount: {
                $sum: { $cond: [{ $eq: ["$applicationOutcome", true] }, 1, 0] }
              }
            }
          },
          {
            $project: {
              _id: 0,
              careerLevel: "$_id",
              totalApplications: "$count",
              successfulApplications: "$successfulCount",
              successRate: {
                $cond: [
                  { $eq: ["$count", 0] },
                  0,
                  { $multiply: [{ $divide: ["$successfulCount", "$count"] }, 100] }
                ]
              }
            }
          }
        ],
        byIndustry: [
          {
            $group: {
              _id: "$applicantIndustry",
              count: { $sum: 1 },
              successfulCount: {
                $sum: { $cond: [{ $eq: ["$applicationOutcome", true] }, 1, 0] }
              }
            }
          },
          {
            $project: {
              _id: 0,
              industry: "$_id",
              totalApplications: "$count",
              successfulApplications: "$successfulCount",
              successRate: {
                $cond: [
                  { $eq: ["$count", 0] },
                  0,
                  { $multiply: [{ $divide: ["$successfulCount", "$count"] }, 100] }
                ]
              }
            }
          }
        ]
      }
    }
  ]);

  return result[0] ?? {
    byGender: [],
    byCareerLevel: [],
    byIndustry: []
  };
}

async TopApplicantSources(companyId: Types.ObjectId, dto:OptionalFilterDTO) {
  const {from, to, industry} = dto ?? {};
  
  const matchStage: any = { companyId };
  if (from || to) {
    matchStage.appliedAt = {};
    if (from) matchStage.appliedAt.$gte = from;
    if (to) matchStage.appliedAt.$lte = to;
  }
  if (industry) matchStage.applicantIndustry = industry;

  const result = await this.applicationRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          industry: "$applicantIndustry",
          careerLevel: "$applicantCarerLevel"
        },
        totalApplications: { $sum: 1 },
        successfulApplications: {
          $sum: { $cond: [{ $eq: ["$applicationOutcome", true] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        industry: "$_id.industry",
        careerLevel: "$_id.careerLevel",
        totalApplications: 1,
        successfulApplications: 1,
        successRate: {
          $cond: [
            { $eq: ["$totalApplications", 0] },
            0,
            { $multiply: [{ $divide: ["$successfulApplications", "$totalApplications"] }, 100] }
          ]
        }
      }
    },
    { $sort: { successfulApplications: -1, successRate: -1 } },
    { $limit: 20 }
  ]);

  return result;
}

}