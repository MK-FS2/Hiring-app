/* eslint-disable @typescript-eslint/no-unsafe-argument */
import AbstractRepository from "@Models/AbstractRepository";
import { Job } from "./jobSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import {CarerExperienceLevels, IndustriesFeilds, JobStatus } from "@Shared/Enums";
import { JobQueryParameters } from "@Shared/Interfaces";




export class JobRepository extends AbstractRepository<Job>
{
    constructor(@InjectModel(Job.name) private readonly JobModel:Model<Job>)
    {
        super(JobModel)
    }


async ApplicantJobsDefault(applicantIndustry:IndustriesFeilds,applicantCarerLevel:CarerExperienceLevels,queryParameters:JobQueryParameters) 
{
  const { page, limit, jobTitle, experienceLevel, maxYear, minYear, city, country, workplaceType, minSalary, maxSalary } = queryParameters;
  const skip = (page - 1) * limit;

  console.log(queryParameters)
  const projection = {
    requirements: 0,
    description: 0,
    currency: 0,
    minYears: 0,
    maxYears: 0,
    maxSalary: 0,
    minSalary: 0,
    city: 0,
    country: 0,
    createdBy: 0,
    updatedBy: 0,
    createdAt: 0,
    isActive: 0,
    status: 0,
    mangerAlert: 0,
    hrAlert: 0,
    hrAlertNote: 0,
    __v: 0
  };

  const options ={skip,limit,populate:{path:"companyId",select:"companyname _id logo.URL"}};

  const filters:any = 
  {
    isActive: true,
    status: JobStatus.Open,
    industry:applicantIndustry,
    experienceLevel:applicantCarerLevel
  };


  if (jobTitle) filters.title = { $regex: jobTitle, $options: "i" };
  if (experienceLevel) filters.experienceLevel = experienceLevel;
  if (minYear !== undefined) filters.minYears = { $lte: minYear };
  if (maxYear !== undefined) filters.maxYears = { $gte: maxYear };
  if (city) filters.city = { $regex:city, $options: "i" };
  if (country) filters.country = { $regex: country, $options: "i" };
  if (workplaceType) filters.workplaceType = workplaceType;
  if (minSalary != undefined) filters.minSalary = { $lte: minSalary };
  if (maxSalary != undefined) filters.maxSalary = { $gte: maxSalary };
 
 
  const jobs = await this.Find(filters,projection,options)
  return jobs || [];
}


}