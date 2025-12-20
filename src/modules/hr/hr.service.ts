import { SavedPostsRepository } from './../../models/SavedJobPosts/savedposts.Repository';
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AddJobEntity, UpdateJobEntity } from './entity';
import  { Types } from 'mongoose';
import { ApplicationStatus, JobStatus } from '@Shared/Enums';
import { JobRepository } from '@Models/Job';
import { ApplicationRepository } from '@Models/Application';
import { InterviewDTO, ProcessAplicationDTO } from './dto';
import { HRFactory } from './factory';
import { InterviewRepository } from '@Models/Interview';
import { MailService } from '@Shared/Utils';



@Injectable()
export class HrService 
{
constructor(
private readonly jobRepository:JobRepository,
private readonly applicationRepository:ApplicationRepository,
private readonly interviewRepository:InterviewRepository,
private readonly hrFactory:HRFactory,
private readonly mailService:MailService,
private readonly savedPostsRepository:SavedPostsRepository
){}

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

async GetPendingJobApplications(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const jobExist = await this.jobRepository.FindOne({_id:jobId,companyId:companyId})
if(!jobExist)
{
    throw new NotFoundException("Job No longer Exist")
}

const applications = await this.applicationRepository.Find({jobId,companyId,status:ApplicationStatus.Pending},{"cv.ID":0,"cv._id":0})
if(!applications)
{
return []
}
else 
{
    return applications
}
}

async ProcessApplicants(processAplicationDTO:ProcessAplicationDTO,companyId:Types.ObjectId)
{
const {jobId,applicationId,decision} = processAplicationDTO
const applicationExist = await this.applicationRepository.FindOne({_id:applicationId,jobId,companyId,status:ApplicationStatus.Pending},{applicantEmail:1})
if(!applicationExist)
{
  throw new NotFoundException("No Application Found")
}
// the idea was it will be under reviw if ther was an ATS but for now i will skipp this part to be manual 
const newStatus = decision ? ApplicationStatus.Under_Interview : ApplicationStatus.Rejected

const result = await this.applicationRepository.UpdateOne({_id:applicationId,jobId,companyId},{status:newStatus})
if(!result)
{
 throw new InternalServerErrorException("Error Updateing")
}

if(decision)
{
const constructedInterview = this.hrFactory.CreateInterview(jobId,companyId,applicationId)
const creatingResult = await this.interviewRepository.CreatDocument(constructedInterview)
if(!creatingResult)
{
    // role back
    await this.applicationRepository.UpdateOne({_id:applicationId,jobId,companyId},{status:ApplicationStatus.Pending})
    throw new InternalServerErrorException("Error creating Interview")
}
}
else 
{
await this.mailService.sendCustomMail(
  applicationExist.applicantEmail,
  'Application Update',
  `
    <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
      <h2>Application Status</h2>
      <p>
        Thank you for your interest in the position.
      </p>
      <p>
        After careful review, we will not be moving forward with your application at this time.
      </p>
      <p>
        We wish you success in your job search.
      </p>
      <p style="font-size: 14px; color: #777;">
        This decision is final. Please do not reply to this email.
      </p>
    </div>
  `
);
}
return true
}

async GetAllInterviews(companyId:Types.ObjectId,page:number,limit:number)
{
const skip = Math.ceil((page-1)*limit)
const data = this.interviewRepository.GetjobInterviewList(companyId,skip,limit)
return data
}

async GetJobInterviews(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const list = await this.interviewRepository.Find({companyId,jobId},{__v:0,jobId:0,companyId:0},{populate:{path:"applicationId",select:"applicantName applicantEmail applicantPhone applicantGender"}})
if(!list)
{
 throw new BadRequestException("Invalid Id")
}
else 
{
  return list
}
}

async ScheduleInterview(interviewId:Types.ObjectId,companyId:Types.ObjectId,interviewDTO:InterviewDTO) 
{
 const {interviewDate,interviewTime} = interviewDTO


 const Interview = await this.interviewRepository.GetInterviewDetails(interviewId,companyId)
  
 if(Interview.status == ApplicationStatus.Under_Interview)
 {
 throw new ConflictException("Interview is already scheduled");
 }


  const updateResult = await this.interviewRepository.UpdateOne({_id:interviewId,companyId},{$set:{status:ApplicationStatus.Under_Interview,interviewDate:interviewDate,interviewTime:interviewTime}})
  if(!updateResult)
  {
    throw new InternalServerErrorException("Error Upadting")
  }
   
 const mailHtml = `
 <p>Dear <strong>${Interview.applicantName}</strong>,</p>
 <p>Your interview has been scheduled on <strong>${interviewDTO.interviewDate.toISOString().split('T')[0]} at ${interviewDTO.interviewTime}</strong>.</p>
 <p>Please be prepared and join on time.</p>
 `;


  const sendingResult = await this.mailService.sendCustomMail(Interview.applicantEmail,"Interview Scheduled",mailHtml)
  if(!sendingResult)
  {
    await this.interviewRepository.UpdateOne({_id:interviewId,companyId},{$set:{status:ApplicationStatus.Pending},$unset:{interviewDate:"",interviewTime:""}})
    throw new InternalServerErrorException("Sending failed")
  }
  return true
}

async ToggleJobStatus(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const job = await this.jobRepository.FindOne({_id:jobId,companyId},{status:1,deadline:1})
if(!job)
{
  throw new NotFoundException("No job found")
}

if(job.status == JobStatus.UnderReview)
{
  throw new UnauthorizedException("Job Not yet Active")
}

if(job.deadline < new Date())
{
   throw new UnauthorizedException("Job is expired") 
}


let newStatus

if(job.status == JobStatus.Closed)
{
  newStatus = JobStatus.Open
}
else 
{
    newStatus = JobStatus.Closed
}

const result = await this.jobRepository.UpdateOne({_id:jobId,companyId},{status:newStatus})
if(!result)
{
  throw new InternalServerErrorException("Error updating")
}
return true
}

async DeleteJob(jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const jobExist = await this.jobRepository.Exist({_id:jobId,companyId})
if(!jobExist)
{
 throw new NotFoundException("No job found")
}

const applicationsExist = await this.applicationRepository.Find({jobId,companyId,status:ApplicationStatus.Pending})
if(applicationsExist)
{
  throw new ConflictException('This job cannot be deleted because there are pending applications.')
}

const InterviewsExist = await this.interviewRepository.Find({jobId,companyId,$or:[{status:ApplicationStatus.Pending},{status:ApplicationStatus.Under_Interview}]})
if(InterviewsExist)
{
  throw new ConflictException('This job cannot be deleted because there are pending or under going Interviews.')
}

try 
{
    await this.jobRepository.DeleteOne({_id:jobId,companyId});
    await this.applicationRepository.DeleteMany({jobId,companyId});
    await this.interviewRepository.DeleteMany({jobId,companyId});
    await this.savedPostsRepository.DeleteMany({jobId})
}
 catch (error) 
{
 throw new InternalServerErrorException(`Deleteing failed ${error.message}`)
} 
return true
}

}
