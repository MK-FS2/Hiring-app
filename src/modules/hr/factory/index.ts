import { Injectable } from "@nestjs/common";
import { AddJobDTO } from "../dto";
import { AddJobEntity } from "../entity";
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
     }

     job.skills = addJobDTO.skills
     job.experienceLevel =addJobDTO.experienceLevel
     job.currency = addJobDTO.currency 
     job.companyId = companyId
     job.createdBy = creatorId
     job.deadline = addJobDTO.deadline
     job.degree = addJobDTO.degree
     return job
    }



}