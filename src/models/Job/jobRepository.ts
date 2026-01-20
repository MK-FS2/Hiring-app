import AbstractRepository from "@Models/AbstractRepository";
import { Job } from "./jobSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CarerExperienceLevels, IndustriesFeilds, JobStatus } from "@Shared/Enums";
import { JobQueryParameters } from "@Shared/Interfaces";




export class JobRepository extends AbstractRepository<Job> {
  constructor(@InjectModel(Job.name) private readonly JobModel: Model<Job>) {
    super(JobModel)
  }


 async ApplicantJobsDefault(applicantIndustry: IndustriesFeilds, applicantCarerLevel: CarerExperienceLevels, queryParameters: JobQueryParameters) {
    const { page, limit, jobTitle, experienceLevel, maxYear, minYear, city, country, workplaceType, minSalary, maxSalary } = queryParameters;
    const skip = (page - 1) * limit;

    const filters: any = 
    {
      isActive: true,
      status: JobStatus.Open,
      industry: applicantIndustry,
      experienceLevel: applicantCarerLevel
    };

    if (jobTitle) filters.title = { $regex: jobTitle, $options: "i" };
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (minYear !== undefined) filters.minYears = { $lte: minYear };
    if (maxYear !== undefined) filters.maxYears = { $gte: maxYear };
    if (city) filters.city = { $regex: city, $options: "i" };
    if (country) filters.country = { $regex: country, $options: "i" };
    if (workplaceType) filters.workplaceType = workplaceType;
    if (minSalary !== undefined) filters.maxSalary = { $gte: minSalary };
    if (maxSalary !== undefined) filters.minSalary = { $lte: maxSalary };

    const result = await this.JobModel.aggregate([
      {
        $match: filters
      },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            { 
              $addFields: { 
                page,
                limit,
                totalPages: { $ceil: { $divide: ["$total", limit] } }
              } 
            }
          ],
          jobs: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "companies", // Change to your actual collection name
                localField: "companyId",
                foreignField: "_id",
                as: "companyId"
              }
            },
            { $unwind: "$companyId" },
            {
              $project: {
                // Use INCLUSION (only list what you want)
                _id: 1,
                title: 1,
                industry: 1,
                experienceLevel: 1,
                workplaceType: 1,
                updatedAt: 1,
                // Add any other fields you want to return
                "companyId.companyname": 1,
                "companyId._id": 1,
                "companyId.logo.URL": 1
              }
            }
          ]
        }
      }
    ]);

    return {
      jobs: result[0]?.jobs || [],
      metadata: result[0]?.metadata[0] || { total: 0, page, limit, totalPages: 0 }
    };
}

  async AllJobsWithApplications(companyId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const result = await this.JobModel.aggregate(
      [
        { $match: { companyId, status: { $ne: "under_review" }, ApplicationsCount: { $gt: 0 } } },
        {
          $lookup:
          {
            from: "applications",
            localField: "_id",
            foreignField: "jobId",
            as: "applications"
          }
        },
        { $unwind: { path: "$applications", preserveNullAndEmptyArrays: true } },
        {
          $group:
          {
            _id: "$_id",
            title: { $first: "$title" },
            status: { $first: "$status" },
            deadline: { $first: "$deadline" },
            pendingApplications: { $sum: { $cond: [{ $eq: ["$applications.status", "Pending"] }, 1, 0] } },
            applicationsUnderInterview: { $sum: { $cond: [{ $eq: ["$applications.status", "Under_Interview"] }, 1, 0] } },
            completedApplications:
            {
              $sum:
              {
                $cond:
                  [
                    {
                      $or:
                        [
                          { $eq: ["$applications.status", "Accepted"] },
                          { $eq: ["$applications.status", "Rejected"] }
                        ]
                    }, 1, 0
                  ]
              }
            },
            ApplicationsCount: { $first: "$ApplicationsCount" }
          }
        },
        {
          $project:
          {
            _id: 0,
            jobId: "$_id",
            title: 1,
            status: 1,
            deadline: 1,
            pendingApplications: 1,
            applicationsUnderInterview: 1,
            ApplicationsCount: 1,
            completedApplications: 1,
            completionRate:
            {
              $cond: [
                { $eq: ["$ApplicationsCount", 0] },
                0,
                {
                  $round:
                    [
                      {
                        $multiply:
                          [
                            { $divide: ["$completedApplications", "$ApplicationsCount"] },
                            100
                          ]
                      },
                      0
                    ]
                }
              ]
            }
          }
        },
        { $skip: skip },
        { $limit: limit }
      ]);

    const totalJobs = await this.Find({ companyId, status: { $ne: "under_review" }, ApplicationsCount: { $gt: 0 } })

    const metadata =
    {
      totalJobs: totalJobs ? totalJobs.length : 0,
      page: page,
      limit: limit
    }

    const fullData =
    {
      jobs: result,
      metadata: metadata
    }

    return fullData;
  }



}