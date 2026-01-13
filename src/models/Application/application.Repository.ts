/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from '@Models/AbstractRepository';
import { Application } from './application.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';



export class ApplicationRepository extends AbstractRepository<Application>
{
constructor(@InjectModel(Application.name)private readonly applicationModel:Model<Application>)
{
    super(applicationModel)
}


async AllApplicationsPerJob(companyId: Types.ObjectId, jobId: Types.ObjectId) 
{
  const data = await this.applicationModel.aggregate(
    [
    {
      $match: {
        companyId: new Types.ObjectId(companyId),
        jobId: new Types.ObjectId(jobId)
      }
    },
    {
      $group: {
        _id: "$jobId",
        pendingApplications: {
          $push: { $cond: [{ $eq: ["$status", "Pending"] }, "$$ROOT", "$$REMOVE"] }
        },
        applicationsUnderInterview: {
          $push: { $cond: [{ $eq: ["$status", "Under_Interview"] }, "$$ROOT", "$$REMOVE"] }
        },
        completedApplications: {
          $push: {
            $cond: [
              { $in: ["$status", ["Accepted", "Rejected"]] },
              "$$ROOT",
              "$$REMOVE"
            ]
          }
        }
      }
    }
  ]);

  return data;
}


}