/* eslint-disable @typescript-eslint/no-unsafe-argument */
import AbstractRepository from "@Models/AbstractRepository";
import { Job } from "./jobSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { Degrees, IndustriesFeilds, JobStatus } from "@Shared/Enums";
import { JobQueryParameters } from "@Shared/Interfaces";




export class JobRepository extends AbstractRepository<Job>
{
    constructor(@InjectModel(Job.name) private readonly JobModel:Model<Job>)
    {
        super(JobModel)
    }

async ApplicantJobsDefault(applicantIndustry: IndustriesFeilds,applicantDegrees: Degrees[],applicantSkills: string[],queryParameters: JobQueryParameters) 
{
  const { page, limit, jobTitle, experienceLevel, maxYear, minYear, city, country, workplaceType, minSalary, maxSalary } = queryParameters;
  const skip = (page - 1) * limit;

  const projection = {requirements: 0,description: 0,currency: 0,minYears: 0,maxYears: 0,maxSalary: 0,minSalary: 0,city: 0,country: 0,createdBy: 0,updatedBy: 0,createdAt: 0,isActive: 0,deadline: 0,status: 0,mangerAlert: 0,hrAlert: 0,hrAlertNote: 0,__v: 0};

  const options = { skip: skip, limit: limit, populate: { path: "companyId", select: "companyname _id logo" } };


  const filters: any = {isActive: true,degree: { $in: applicantDegrees },status: JobStatus.Open};


  if (jobTitle) filters.title = { $regex: jobTitle, $options: "i" };
  if (experienceLevel) filters.experienceLevel = experienceLevel;
  if (minYear !== undefined) filters.minYears = { $lte: minYear };
  if (maxYear !== undefined) filters.maxYears = { $gte: maxYear };
  if (city) filters.city = { $regex: city, $options: "i" };
  if (country) filters.country = { $regex: country, $options: "i" };
  if (workplaceType) filters.workplaceType = workplaceType;
  if (minSalary) filters.minSalary = { $lte: minSalary };
  if (maxSalary) filters.maxSalary = { $gte: maxSalary };

  // If applicant has skills, calculate match after getting jobs
  if (applicantSkills.length > 0) 
 {
  const upperApplicantSkills = applicantSkills.map(s => s.toUpperCase());

  const allJobs = await this.Find(filters, projection, { populate: options.populate })

    if (!allJobs) 
    {
      return [];
    }

    const matchedJobs = allJobs.filter(job => 
    {
      const jobSkills = job.skills.map(s => s.toUpperCase());
      const matches = jobSkills.filter(skill => upperApplicantSkills.includes(skill)).length;
      const similarity = (matches / jobSkills.length) * 100;
      
      // Match: same industry with 75%+ OR different industry with 75%+
      if (job.industry === applicantIndustry && similarity >= 75) return true;
      if (job.industry !== applicantIndustry && similarity >= 75) return true;
      
      return false;
    });

    return matchedJobs
    
  } 
  else 
 {
    filters.industry = applicantIndustry;
    const jobs = await this.Find(filters, projection, options);
    return jobs || [];
  }
}


}