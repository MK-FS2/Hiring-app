import { JobRepository } from './../../models/Job/jobRepository';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddJobEntity, UpdateJobEntity } from './entity';
import { Types } from 'mongoose';
import { JobStatus } from '@Shared/Enums';



@Injectable()
export class HrService 
{
constructor(private readonly jobRepository:JobRepository){}

async CreateJob(job:AddJobEntity)
{

if(job.minYears >= job.maxYears)
{
    throw new BadRequestException("minimum years cant be less or equal than max years")
}
if ((job.minSalary && !job.maxSalary) || (job.maxSalary && !job.minSalary) ||(job.minSalary && !job.currency)) 
{
    throw new BadRequestException("Both minSalary and maxSalary and curruncy must be provided together.");
}
if(job.minSalary && job.minSalary > job.maxSalary!)
{
 throw new BadRequestException("maximum salary should be larger than minimum salary");
}

const creationResult = await this.jobRepository.CreatDocument(job)
if(!creationResult)
{
    throw new InternalServerErrorException("Error creating")
}
return true
}

async UpdateJob(job:UpdateJobEntity,jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const jobExist = await this.jobRepository.FindOne({_id:jobId,companyId})
if(!jobExist)
{
    throw new NotFoundException("No job found")
}

if(jobExist.status == JobStatus.Open)
{
    throw new ConflictException("You cant Edit a live job")
}


if ((job.minYears !== undefined && job.maxYears === undefined) ||(job.maxYears !== undefined && job.minYears === undefined)) 
{
  throw new BadRequestException("minYears and maxYears must be provided together.");
}

if(job.minYears >= job.maxYears)
{
    throw new BadRequestException("minimum years cant be less or equal than max years")
}
if ((job.minSalary && !job.maxSalary) || (job.maxSalary && !job.minSalary) ||(job.minSalary && !job.currency)) 
{
    throw new BadRequestException("Both minSalary and maxSalary and curruncy must be provided together.");
}
if(job.minSalary && job.minSalary > job.maxSalary!)
{
 throw new BadRequestException("maximum salary should be larger than minimum salary");
}

const updateResult = await this.jobRepository.UpdateOne({_id:jobId,companyId},{$set:{...job,hrAlert:false,mangerAlert:true},$unset:{hrAlertNote:""}})
if(!updateResult)
{
    throw new InternalServerErrorException("Error Updating")
}
return true
}

}
