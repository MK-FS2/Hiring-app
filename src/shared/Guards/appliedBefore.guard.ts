import { ApplicationRepository } from '@Models/Application';
import { JobRepository } from '@Models/Job';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JobStatus } from '@Shared/Enums';
import { Types } from "mongoose";



@Injectable()
export class AppliedBefore implements CanActivate {
  constructor(private readonly jobRepository: JobRepository,private readonly applicationRepository: ApplicationRepository) {}

  async canActivate(context: ExecutionContext) 
  {
    const req = context.switchToHttp().getRequest();
    const { jobId }: { jobId?: string } = req.params;
    const applicantId: Types.ObjectId = req.User._id;

    if (!jobId) throw new BadRequestException("Missing job ID");
    if (!Types.ObjectId.isValid(jobId)) throw new BadRequestException("Invalid job ID");

    const jobIdObj = new Types.ObjectId(jobId);
    const job = await this.jobRepository.FindOne({_id:jobIdObj},{status:1,isActive:1,deadline:1});

    if (!job) throw new NotFoundException("No job found");
    if (!job.isActive) throw new BadRequestException("The job is not active");
    if (job.status !== JobStatus.Open || new Date(job.deadline) < new Date()) 
    {
      throw new BadRequestException("You can't apply for a closed job");
    }

    const hasApplied = await this.applicationRepository.Exist({jobId:jobIdObj,applicantId});

    if (hasApplied) throw new UnauthorizedException("You already applied. Please wait for a response.");

    return true;
  }
}
