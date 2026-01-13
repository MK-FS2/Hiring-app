/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { OptionalInterval } from '@modules/reports/dto';
import { EmployeeAction } from './employeeActions.Schema';
import { HrActionsTypes } from '@Shared/Enums';

@Injectable()
export class EmployeeActionRepository extends AbstractRepository<EmployeeAction> 
{
  constructor(@InjectModel(EmployeeAction.name)private readonly employeeActionModel:Model<EmployeeAction>) 
  {
    super(employeeActionModel);
  }

async RecordAction(employeeId:Types.ObjectId,targetType:HrActionsTypes)
{
const result = await this.CreatDocument({employeeId,targetType})
return result 
}

async EmployeeActivitySummary(employeeId: Types.ObjectId, companyId: Types.ObjectId, dto?: OptionalInterval) {
 
    const {from, to} = dto ?? {};
    
    const matchStage: any = { employeeId };
    if (from || to) {
      matchStage.doneAt = {};
      if (from) matchStage.doneAt.$gte = from;
      if (to) matchStage.doneAt.$lte = to;
    }

    const result = await this.employeeActionModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$targetType",
          actionCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalActions: { $sum: "$actionCount" },
          actionsByType: {
            $push: {
              actionType: "$_id",
              count: "$actionCount"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          employeeId: employeeId,
          totalActions: 1,
          actionsByType: 1
        }
      }
    ]);

    return result[0] ?? {
      employeeId: employeeId,
      totalActions: 0,
      actionsByType: []
    };
}

  async EmployeeProductivity(employeeId: Types.ObjectId, companyId: Types.ObjectId, dto?: OptionalInterval) {

    const {from, to} = dto ?? {};
    
    const matchStage: any = { employeeId };
    if (from || to) {
      matchStage.doneAt = {};
      if (from) matchStage.doneAt.$gte = from;
      if (to) matchStage.doneAt.$lte = to;
    }

    const result = await this.employeeActionModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          dailyStats: [
            {
              $group: {
                _id: {
                  year: { $year: "$doneAt" },
                  month: { $month: "$doneAt" },
                  day: { $dayOfMonth: "$doneAt" }
                },
                actionsPerDay: { $sum: 1 }
              }
            },
            {
              $group: {
                _id: null,
                avgActionsPerDay: { $avg: "$actionsPerDay" },
                maxActionsPerDay: { $max: "$actionsPerDay" },
                minActionsPerDay: { $min: "$actionsPerDay" },
                totalDays: { $sum: 1 }
              }
            }
          ],
          hourlyDistribution: [
            {
              $group: {
                _id: { $hour: "$doneAt" },
                actionsInHour: { $sum: 1 }
              }
            },
            {
              $sort: { actionsInHour: -1 }
            },
            {
              $limit: 5
            },
            {
              $project: {
                _id: 0,
                hour: "$_id",
                actionsCount: "$actionsInHour"
              }
            }
          ]
        }
      }
    ]);

    const dailyStats = result[0]?.dailyStats[0] ?? {
      avgActionsPerDay: 0,
      maxActionsPerDay: 0,
      minActionsPerDay: 0,
      totalDays: 0
    };

    return {
      employeeId: employeeId,
      avgActionsPerDay: parseFloat((dailyStats.avgActionsPerDay || 0).toFixed(2)),
      maxActionsPerDay: dailyStats.maxActionsPerDay || 0,
      minActionsPerDay: dailyStats.minActionsPerDay || 0,
      totalActiveDays: dailyStats.totalDays || 0,
      busiestHours: result[0]?.hourlyDistribution || []
    };
  }

  async EmployeeActionTimeline(employeeId: Types.ObjectId, companyId: Types.ObjectId, dto?: OptionalInterval) {
    const {from, to} = dto ?? {};
    
    const matchStage: any = { employeeId };
    if (from || to) {
      matchStage.doneAt = {};
      if (from) matchStage.doneAt.$gte = from;
      if (to) matchStage.doneAt.$lte = to;
    }

    const result = await this.employeeActionModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$doneAt" },
            month: { $month: "$doneAt" },
            actionType: "$targetType"
          },
          actionCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month"
          },
          totalActions: { $sum: "$actionCount" },
          actionBreakdown: {
            $push: {
              actionType: "$_id.actionType",
              count: "$actionCount"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalActions: 1,
          actionBreakdown: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    return {
      employeeId: employeeId,
      timeline: result
    };
  }

  async EmployeePerformanceScore(employeeId: Types.ObjectId, companyId: Types.ObjectId, dto?: OptionalInterval) {
    const {from, to} = dto ?? {};
    
    const matchStage: any = { employeeId };
    if (from || to) {
      matchStage.doneAt = {};
      if (from) matchStage.doneAt.$gte = from;
      if (to) matchStage.doneAt.$lte = to;
    }

    const result = await this.employeeActionModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalActions: [
            {
              $count: "count"
            }
          ],
          actionsByType: [
            {
              $group: {
                _id: "$targetType",
                count: { $sum: 1 }
              }
            }
          ],
          timespan: [
            {
              $group: {
                _id: null,
                firstAction: { $min: "$doneAt" },
                lastAction: { $max: "$doneAt" }
              }
            }
          ]
        }
      }
    ]);

    const totalActions = result[0]?.totalActions[0]?.count || 0;
    const actionTypes = result[0]?.actionsByType?.length || 0;
    const timespan = result[0]?.timespan[0];

    let daysActive = 1;
    if (timespan && timespan.firstAction && timespan.lastAction) {
      daysActive = Math.max(1, Math.ceil((timespan.lastAction - timespan.firstAction) / (1000 * 60 * 60 * 24)));
    }

    const avgActionsPerDay = totalActions / daysActive;
    const diversityScore = Math.min(actionTypes * 10, 50); // Max 50 points for diversity
    const volumeScore = Math.min(avgActionsPerDay * 10, 50); // Max 50 points for volume

    return {
      employeeId: employeeId,
      totalActions: totalActions,
      daysActive: daysActive,
      avgActionsPerDay: parseFloat(avgActionsPerDay.toFixed(2)),
      actionTypesUsed: actionTypes,
      performanceScore: parseFloat((diversityScore + volumeScore).toFixed(2)),
      scoreBreakdown: {
        diversityScore: parseFloat(diversityScore.toFixed(2)),
        volumeScore: parseFloat(volumeScore.toFixed(2))
      }
    };
  }

  async EmployeeActionTypeBreakdown(employeeId: Types.ObjectId, companyId: Types.ObjectId, dto?: OptionalInterval) {

    const {from, to} = dto ?? {};
    
    const matchStage: any = { employeeId };
    if (from || to) {
      matchStage.doneAt = {};
      if (from) matchStage.doneAt.$gte = from;
      if (to) matchStage.doneAt.$lte = to;
    }

    const result = await this.employeeActionModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalCount: [
            { $count: "total" }
          ],
          breakdown: [
            {
              $group: {
                _id: "$targetType",
                count: { $sum: 1 },
                firstOccurrence: { $min: "$doneAt" },
                lastOccurrence: { $max: "$doneAt" }
              }
            },
            {
              $sort: { count: -1 }
            }
          ]
        }
      }
    ]);

    const totalCount = result[0]?.totalCount[0]?.total || 0;
    const breakdown = result[0]?.breakdown || [];

    const breakdownWithPercentage = breakdown.map(item => ({
      actionType: item._id,
      count: item.count,
      percentage: totalCount > 0 ? parseFloat(((item.count / totalCount) * 100).toFixed(2)) : 0,
      firstOccurrence: item.firstOccurrence,
      lastOccurrence: item.lastOccurrence
    }));

    return {
      employeeId: employeeId,
      totalActions: totalCount,
      breakdown: breakdownWithPercentage
    };
  }

}