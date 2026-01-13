/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InterviewRecord } from './interviewStatistics.schema';
import { InterviewRecordEntity } from '@modules/hr';
import { OptionalInterval } from '@modules/reports/dto';

@Injectable()
export class InterviewRecordRepository extends AbstractRepository<InterviewRecord>
{
constructor(@InjectModel(InterviewRecord.name) private readonly interviewRecordModel:Model<InterviewRecord>)
{
super(interviewRecordModel);
}

async AddRecord(interviewRecordEntity:InterviewRecordEntity)
{
const result = await this.CreatDocument(interviewRecordEntity)
return result
}

async InterviewSuccessRate(companyId: Types.ObjectId, dto?: OptionalInterval) {
  const {from, to} = dto ?? {};
  
  const matchStage: any = { companyId, interviewOutcome: { $exists: true } };
  if (from || to) {
    matchStage.scheduledAt = {};
    if (from) matchStage.scheduledAt.$gte = from;
    if (to) matchStage.scheduledAt.$lte = to;
  }

  const result = await this.interviewRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalInterviews: { $sum: 1 },
        successfulInterviews: {
          $sum: { $cond: [{ $eq: ["$interviewOutcome", true] }, 1, 0] }
        },
        failedInterviews: {
          $sum: { $cond: [{ $eq: ["$interviewOutcome", false] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalInterviews: 1,
        successfulInterviews: 1,
        failedInterviews: 1,
        successRate: {
          $cond: [
            { $eq: ["$totalInterviews", 0] },
            0,
            { $multiply: [{ $divide: ["$successfulInterviews", "$totalInterviews"] }, 100] }
          ]
        }
      }
    }
  ]);

  const stats = result[0] ?? {
    totalInterviews: 0,
    successfulInterviews: 0,
    failedInterviews: 0,
    successRate: 0
  };

  return {
    ...stats,
    successRate: parseFloat(stats.successRate.toFixed(2))
  };
}

async AverageInterviewDuration(companyId: Types.ObjectId, dto?: OptionalInterval) {
  const {from, to} = dto ?? {};
  
  const matchStage: any = { companyId, completedAt: { $exists: true } };
  if (from || to) {
    matchStage.scheduledAt = {};
    if (from) matchStage.scheduledAt.$gte = from;
    if (to) matchStage.scheduledAt.$lte = to;
  }

  const result = await this.interviewRecordModel.aggregate([
    { $match: matchStage },
    {
      $project: {
        durationInMs: { $subtract: ["$completedAt", "$scheduledAt"] }
      }
    },
    {
      $group: {
        _id: null,
        avgDurationInMs: { $avg: "$durationInMs" },
        maxDurationInMs: { $max: "$durationInMs" },
        minDurationInMs: { $min: "$durationInMs" },
        totalInterviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    const avgMs = result[0].avgDurationInMs;
    const maxMs = result[0].maxDurationInMs;
    const minMs = result[0].minDurationInMs;
    
    return {
      avgDurationInMinutes: parseFloat((avgMs / (1000 * 60)).toFixed(2)),
      avgDurationInHours: parseFloat((avgMs / (1000 * 60 * 60)).toFixed(2)),
      maxDurationInMinutes: parseFloat((maxMs / (1000 * 60)).toFixed(2)),
      minDurationInMinutes: parseFloat((minMs / (1000 * 60)).toFixed(2)),
      totalCompletedInterviews: result[0].totalInterviews
    };
  }

  return {
    avgDurationInMinutes: 0,
    avgDurationInHours: 0,
    maxDurationInMinutes: 0,
    minDurationInMinutes: 0,
    totalCompletedInterviews: 0
  };
}

async InterviewConversionFunnel(companyId: Types.ObjectId, dto?: OptionalInterval) {
  const {from, to} = dto ?? {};
  
  const matchStage: any = { companyId };
  if (from || to) {
    matchStage.scheduledAt = {};
    if (from) matchStage.scheduledAt.$gte = from;
    if (to) matchStage.scheduledAt.$lte = to;
  }

  const result = await this.interviewRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalScheduled: { $sum: 1 },
        totalCompleted: {
          $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] }
        },
        totalSuccessful: {
          $sum: { $cond: [{ $eq: ["$interviewOutcome", true] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalScheduled: 1,
        totalCompleted: 1,
        totalSuccessful: 1,
        completionRate: {
          $cond: [
            { $eq: ["$totalScheduled", 0] },
            0,
            { $multiply: [{ $divide: ["$totalCompleted", "$totalScheduled"] }, 100] }
          ]
        },
        successRateOfCompleted: {
          $cond: [
            { $eq: ["$totalCompleted", 0] },
            0,
            { $multiply: [{ $divide: ["$totalSuccessful", "$totalCompleted"] }, 100] }
          ]
        },
        overallSuccessRate: {
          $cond: [
            { $eq: ["$totalScheduled", 0] },
            0,
            { $multiply: [{ $divide: ["$totalSuccessful", "$totalScheduled"] }, 100] }
          ]
        }
      }
    }
  ]);

  const stats = result[0] ?? {
    totalScheduled: 0,
    totalCompleted: 0,
    totalSuccessful: 0,
    completionRate: 0,
    successRateOfCompleted: 0,
    overallSuccessRate: 0
  };

  return {
    ...stats,
    completionRate: parseFloat(stats.completionRate.toFixed(2)),
    successRateOfCompleted: parseFloat(stats.successRateOfCompleted.toFixed(2)),
    overallSuccessRate: parseFloat(stats.overallSuccessRate.toFixed(2))
  };
}

async InterviewTrends(companyId: Types.ObjectId, monthsBack?: number, dto?: OptionalInterval) {

  const finalMonthsBack = monthsBack ?? 12;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - finalMonthsBack);

  const {from, to} = dto ?? {};
  
  const matchStage: any = { companyId };
  
  if (from || to) {
    matchStage.scheduledAt = {};
    if (from) matchStage.scheduledAt.$gte = from;
    if (to) matchStage.scheduledAt.$lte = to;
  } else {
    matchStage.scheduledAt = { $gte: startDate };
  }

  const result = await this.interviewRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: "$scheduledAt" },
          month: { $month: "$scheduledAt" }
        },
        totalScheduled: { $sum: 1 },
        totalCompleted: {
          $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] }
        },
        totalSuccessful: {
          $sum: { $cond: [{ $eq: ["$interviewOutcome", true] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalScheduled: 1,
        totalCompleted: 1,
        totalSuccessful: 1,
        completionRate: {
          $cond: [
            { $eq: ["$totalScheduled", 0] },
            0,
            { $multiply: [{ $divide: ["$totalCompleted", "$totalScheduled"] }, 100] }
          ]
        },
        successRate: {
          $cond: [
            { $eq: ["$totalCompleted", 0] },
            0,
            { $multiply: [{ $divide: ["$totalSuccessful", "$totalCompleted"] }, 100] }
          ]
        }
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);

  return result;
}

async InterviewPerformanceByJob(companyId: Types.ObjectId, dto?: OptionalInterval) {

  const {from, to} = dto ?? {};
  
  const matchStage: any = { companyId };
  if (from || to) {
    matchStage.scheduledAt = {};
    if (from) matchStage.scheduledAt.$gte = from;
    if (to) matchStage.scheduledAt.$lte = to;
  }

  const result = await this.interviewRecordModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$jobId",
        totalInterviews: { $sum: 1 },
        completedInterviews: {
          $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] }
        },
        successfulInterviews: {
          $sum: { $cond: [{ $eq: ["$interviewOutcome", true] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        jobId: "$_id",
        totalInterviews: 1,
        completedInterviews: 1,
        successfulInterviews: 1,
        completionRate: {
          $cond: [
            { $eq: ["$totalInterviews", 0] },
            0,
            { $multiply: [{ $divide: ["$completedInterviews", "$totalInterviews"] }, 100] }
          ]
        },
        successRate: {
          $cond: [
            { $eq: ["$completedInterviews", 0] },
            0,
            { $multiply: [{ $divide: ["$successfulInterviews", "$completedInterviews"] }, 100] }
          ]
        }
      }
    },
    { $sort: { totalInterviews: -1 } },
    { $limit: 20 }
  ]);

  return result;
}

}