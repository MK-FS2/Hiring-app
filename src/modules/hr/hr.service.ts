import { JobRepository } from './../../models/Job/jobRepository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddJobEntity } from './entity';



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
if ((job.minSalary && !job.maxSalary) || (job.maxSalary && !job.minSalary)) 
{
    throw new BadRequestException("Both minSalary and maxSalary must be provided together.");
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



}
