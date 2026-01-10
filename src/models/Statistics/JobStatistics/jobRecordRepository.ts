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
    const result = await this.CreatDocument(jobRecordEntity);
    return result;
  }



  async JobsCreatedInterval(from: Date, to: Date, companyId: Types.ObjectId) 
  {
    const result = await this.jobRecordModel.aggregate([
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
            {$multiply:[{$divide:["$totalApplications","$totalViews"]},100]}
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
    const jobs = await this.jobRecordModel.aggregate([
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
    ]);

    return jobs.length ? jobs : [];
  }


  async JobEngagementMetrics(jobId:Types.ObjectId,companyId: Types.ObjectId) {

    const result = await this.jobRecordModel.aggregate([
      { $match: { jobId, companyId } },
      {
        $project: {
          _id: 0,
          jobId: 1,
          views: 1,
          saves: 1,
          applications: 1,
          viewToSaveRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $multiply: [{ $divide: ["$saves", "$views"] }, 100] }
            ]
          },
          viewToApplicationRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $multiply: [{ $divide: ["$applications", "$views"] }, 100] }
            ]
          },
          saveToApplicationRate: {
            $cond: [
              { $eq: ["$saves", 0] },
              0,
              { $multiply: [{ $divide: ["$applications", "$saves"] }, 100] }
            ]
          }
        }
      }
    ]);

    return result[0] ?? null;
  }

  async JobPerformanceScore(jobId: Types.ObjectId, companyId: Types.ObjectId) {

    const result = await this.jobRecordModel.aggregate([
      { $match: { jobId, companyId } },
      {
        $project: {
          _id: 0,
          jobId: 1,
          conversionRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $divide: ["$applications", "$views"] }
            ]
          },
          engagementRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $divide: [{ $add: ["$saves", "$applications"] }, "$views"] }
            ]
          },
          performanceScore: {
            $multiply: [
              {
                $add: [
                  { $multiply: [{ $cond: [{ $eq: ["$views", 0] }, 0, { $divide: ["$applications", "$views"] }] }, 50] },
                  { $multiply: [{ $cond: [{ $eq: ["$views", 0] }, 0, { $divide: ["$saves", "$views"] }] }, 30] },
                  { $cond: [{ $gte: ["$applications", 5] }, 20, { $multiply: ["$applications", 4] }] }
                ]
              },
              1
            ]
          }
        }
      }
    ]);

    return result[0] ?? null;
  }

  async JobWorkplaceTypeComparison(jobId: Types.ObjectId, companyId: Types.ObjectId) {
  
    const result = await this.jobRecordModel.aggregate([
      { $match: { companyId } },
      {
        $facet: {
          targetJob: [
            { $match: { jobId } },
            {
              $project: {
                _id: 0,
                jobId: 1,
                workplaceType: 1,
                views: 1,
                saves: 1,
                applications: 1
              }
            }
          ],
          comparison: [
            {
              $group: {
                _id: "$workplaceType",
                avgViews: { $avg: "$views" },
                avgSaves: { $avg: "$saves" },
                avgApplications: { $avg: "$applications" },
                totalJobs: { $sum: 1 }
              }
            }
          ]
        }
      },
      {
        $project: {
          targetJob: { $arrayElemAt: ["$targetJob", 0] },
          comparison: 1
        }
      }
    ]);

    return result[0] ?? null;
  }

  async JobTimeSeries(jobId: Types.ObjectId, companyId: Types.ObjectId) {

    const result = await this.jobRecordModel.aggregate([
      { $match: { jobId, companyId } },
      {
        $project: {
          _id: 0,
          jobId: 1,
          createdAt: 1,
          views: 1,
          saves: 1,
          applications: 1,
          daysActive: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60 * 24
            ]
          },
          viewsPerDay: {
            $cond: [
              { $eq: [{ $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] }, 0] },
              "$views",
              { $divide: ["$views", { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] }] }
            ]
          },
          applicationsPerDay: {
            $cond: [
              { $eq: [{ $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] }, 0] },
              "$applications",
              { $divide: ["$applications", { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] }] }
            ]
          }
        }
      }
    ]);

    return result[0] ?? null;
  }

  async JobIndustryRanking(jobId: Types.ObjectId, companyId: Types.ObjectId) {
    // Rank this job among all jobs in the same industry
    const result = await this.jobRecordModel.aggregate([
      { $match: { companyId } },
      {
        $setWindowFields: {
          partitionBy: "$jobIndustry",
          sortBy: { applications: -1 },
          output: {
            rankByApplications: { $rank: {} }
          }
        }
      },
      {
        $setWindowFields: {
          partitionBy: "$jobIndustry",
          sortBy: { views: -1 },
          output: {
            rankByViews: { $rank: {} }
          }
        }
      },
      { $match: { jobId } },
      {
        $lookup: {
          from: "jobrecords",
          let: { industry: "$jobIndustry" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$jobIndustry", "$$industry"] }, { $eq: ["$companyId", companyId] }] } } },
            { $count: "total" }
          ],
          as: "industryTotal"
        }
      },
      {
        $project: {
          _id: 0,
          jobId: 1,
          jobIndustry: 1,
          rankByApplications: 1,
          rankByViews: 1,
          totalInIndustry: { $arrayElemAt: ["$industryTotal.total", 0] },
          views: 1,
          applications: 1
        }
      }
    ]);

    return result[0] ?? null;
  }


  async OverallHiringFunnel(companyId: Types.ObjectId, from?: Date, to?: Date) {
    // Complete conversion funnel: views -> saves -> applications
    const matchStage: any = { companyId };
    if (from || to) {
      matchStage.createdAt = {};
      if (from) matchStage.createdAt.$gte = from;
      if (to) matchStage.createdAt.$lte = to;
    }

    const result = await this.jobRecordModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalSaves: { $sum: "$saves" },
          totalApplications: { $sum: "$applications" },
          totalJobs: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalViews: 1,
          totalSaves: 1,
          totalApplications: 1,
          totalJobs: 1,
          viewToSaveRate: {
            $multiply: [
              { $cond: [{ $eq: ["$totalViews", 0] }, 0, { $divide: ["$totalSaves", "$totalViews"] }] },
              100
            ]
          },
          saveToApplicationRate: {
            $multiply: [
              { $cond: [{ $eq: ["$totalSaves", 0] }, 0, { $divide: ["$totalApplications", "$totalSaves"] }] },
              100
            ]
          },
          viewToApplicationRate: {
            $multiply: [
              { $cond: [{ $eq: ["$totalViews", 0] }, 0, { $divide: ["$totalApplications", "$totalViews"] }] },
              100
            ]
          }
        }
      }
    ]);

    return result[0] ?? null;
  }

  async TopPerformingJobs(companyId: Types.ObjectId, limit?: number) {
    // Top jobs by conversion rate and applications
    const finalLimit = limit ?? 10;
    
    const result = await this.jobRecordModel.aggregate([
      { $match: { companyId } },
      {
        $project: {
          _id: 0,
          jobId: 1,
          jobIndustry: 1,
          workplaceType: 1,
          requiredCarerLevel: 1,
          views: 1,
          saves: 1,
          applications: 1,
          createdAt: 1,
          conversionRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $multiply: [{ $divide: ["$applications", "$views"] }, 100] }
            ]
          }
        }
      },
      { $sort: { conversionRate: -1, applications: -1 } },
      { $limit: finalLimit }
    ]);

    return result;
  }

  async WorkplaceTypeDistribution(companyId: Types.ObjectId) {
    // Distribution and performance by workplace type
    const result = await this.jobRecordModel.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: "$workplaceType",
          totalJobs: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalSaves: { $sum: "$saves" },
          totalApplications: { $sum: "$applications" },
          avgViews: { $avg: "$views" },
          avgApplications: { $avg: "$applications" }
        }
      },
      {
        $project: {
          _id: 0,
          workplaceType: "$_id",
          totalJobs: 1,
          totalViews: 1,
          totalSaves: 1,
          totalApplications: 1,
          avgViews: { $round: ["$avgViews", 2] },
          avgApplications: { $round: ["$avgApplications", 2] },
          conversionRate: {
            $multiply: [
              { $cond: [{ $eq: ["$totalViews", 0] }, 0, { $divide: ["$totalApplications", "$totalViews"] }] },
              100
            ]
          }
        }
      },
      { $sort: { totalJobs: -1 } }
    ]);

    return result;
  }

 

  async CareerLevelPerformance(companyId: Types.ObjectId) {
    // Performance metrics grouped by career level
    const result = await this.jobRecordModel.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: "$requiredCarerLevel",
          totalJobs: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalSaves: { $sum: "$saves" },
          totalApplications: { $sum: "$applications" },
          avgViews: { $avg: "$views" },
          avgApplications: { $avg: "$applications" },
          maxApplications: { $max: "$applications" },
          minApplications: { $min: "$applications" }
        }
      },
      {
        $project: {
          _id: 0,
          careerLevel: "$_id",
          totalJobs: 1,
          totalViews: 1,
          totalSaves: 1,
          totalApplications: 1,
          avgViews: { $round: ["$avgViews", 2] },
          avgApplications: { $round: ["$avgApplications", 2] },
          maxApplications: 1,
          minApplications: 1,
          conversionRate: {
            $round: [
              {
                $multiply: [
                  { $cond: [{ $eq: ["$totalViews", 0] }, 0, { $divide: ["$totalApplications", "$totalViews"] }] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { totalApplications: -1 } }
    ]);

    return result;
  }
}