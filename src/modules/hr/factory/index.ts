import { CreateInterviewEntity } from './../entity/createInterview.entity';
import { UpdateJobDTO } from './../dto/updateJob.dto';
import { Injectable } from "@nestjs/common";
import { AddJobDTO } from "../dto";
import { AddJobEntity, UpdateJobEntity } from "../entity";
import { Types } from "mongoose";


@Injectable()
export class HRFactory 
{

    CreateJob(addJobDTO:AddJobDTO,companyId:Types.ObjectId,creatorId:Types.ObjectId)
    {
     const job = new AddJobEntity()
      
     job.country = addJobDTO.country
     job.city =addJobDTO.city
     job.maxYears =addJobDTO.maxYears
     job.minYears = addJobDTO.minYears
     job.title = addJobDTO.title
     job.requirements = addJobDTO.requirements
     job.description = addJobDTO.description
     job.industry = addJobDTO.industry
     job.workplaceType = addJobDTO.workplaceType
     if(addJobDTO.maxsalary)
     {
      job.maxSalary =addJobDTO.maxsalary
      job.minSalary =addJobDTO.mingsalary  
      job.currency = addJobDTO.currency
     }

     job.skills = addJobDTO.skills.map((skill)=>skill.toUpperCase())
     job.experienceLevel =addJobDTO.experienceLevel 
     job.companyId = companyId
     job.createdBy = creatorId
     job.deadline = addJobDTO.deadline
     job.degree = addJobDTO.degree
     return job
    }

 UpdateJob(updateJobDTO:UpdateJobDTO, editorId:Types.ObjectId) 
 {
  const job = new UpdateJobEntity();

  if (updateJobDTO.title) job.title = updateJobDTO.title;
  if (updateJobDTO.description) job.description = updateJobDTO.description;
  if (updateJobDTO.requirements) job.requirements = updateJobDTO.requirements;
  if (updateJobDTO.skills) job.skills = updateJobDTO.skills;
  if (updateJobDTO.city) job.city = updateJobDTO.city;
  if (updateJobDTO.country) job.country = updateJobDTO.country;

  if (updateJobDTO.maxsalary) 
 {
    job.maxSalary = updateJobDTO.maxsalary;
    job.minSalary = updateJobDTO.mingsalary;
    job.currency = updateJobDTO.currency;
  }

  if (updateJobDTO.maxYears !== undefined) job.maxYears = updateJobDTO.maxYears;
  if (updateJobDTO.minYears !== undefined) job.minYears = updateJobDTO.minYears;

  if (updateJobDTO.workplaceType) job.workplaceType = updateJobDTO.workplaceType;
  if (updateJobDTO.industry) job.industry = updateJobDTO.industry;
  if (updateJobDTO.experienceLevel) job.experienceLevel = updateJobDTO.experienceLevel;
  if (updateJobDTO.degree) job.degree = updateJobDTO.degree;

  job.updatedBy = editorId;

  return job;
}

CreateInterview(jobId:Types.ObjectId,companyId:Types.ObjectId,applicationId:Types.ObjectId)
{
  const interview = new CreateInterviewEntity()
  interview.companyId = companyId
  interview.jobId =  jobId
  interview.applicationId = applicationId
  return interview
}

}