/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AddJobEntity, InterviewRecordEntity, JobRecordEntity, UpdateJobEntity } from './entity';
import  { Types } from 'mongoose';
import { ApplicationStatus, HrActionsTypes, JobStatus } from '@Shared/Enums';
import { JobRepository } from '@Models/Job';
import { ApplicationRepository } from '@Models/Application';
import { InterviewDTO, ProcessAplicationDTO } from './dto';
import { HRFactory } from './factory';
import { InterviewRepository } from '@Models/Interview';
import { MailService } from '@Shared/Utils';
import { JobRecordRepository } from '@Models/Statistics/JobStatistics';
import { SavedPostsRepository } from '@Models/SavedJobPosts';
import { EmployeeActionRepository } from '@Models/Statistics/EmployeeStatistics/EmployeeActions';
import { InterviewRecordRepository } from '@Models/Statistics/InterviewStatistics';
import { ApplicationRecordRepository } from '@Models/Statistics/ApplicationStatistics';



@Injectable()
export class HrService 
{
constructor(
private readonly jobRepository:JobRepository,
private readonly applicationRepository:ApplicationRepository,
private readonly interviewRepository:InterviewRepository,
private readonly hrFactory:HRFactory,
private readonly mailService:MailService,
private readonly savedPostsRepository:SavedPostsRepository,
private readonly employeeActionRepository:EmployeeActionRepository,
private readonly jobRecordRepository:JobRecordRepository,
private readonly applicationRecordRepository:ApplicationRecordRepository,
private readonly interviewRecordRepository:InterviewRecordRepository
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
if(!creationResult)throw new InternalServerErrorException("Error creating")

await this.employeeActionRepository.RecordAction(job.createdBy,HrActionsTypes.CreateJob)

const jobRecord:JobRecordEntity = 
  {
  jobId: creationResult._id,
  companyId: job.companyId,
  creatorId: job.createdBy,
  requiredCarerLevel: job.experienceLevel, 
  workplaceType: job.workplaceType,
  jobIndustry: job.industry, 
}

await this.jobRecordRepository.AddRecord(jobRecord)

return true
}

async UpdateJob(job:UpdateJobEntity,jobId:Types.ObjectId,companyId:Types.ObjectId)
{
const jobExist = await this.jobRepository.FindOne({_id:jobId,companyId})
if(!jobExist)throw new NotFoundException("No job found")


if(jobExist.status == JobStatus.Open)throw new ConflictException("You cant Edit a live job")


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
if(!updateResult)throw new InternalServerErrorException("Error Updating")

await this.employeeActionRepository.RecordAction(job.updatedBy!,HrActionsTypes.UpdateJob)

return true
}


async ProcessApplicants(processAplicationDTO:ProcessAplicationDTO,companyId:Types.ObjectId,hrId:Types.ObjectId)
{
const {jobId,applicationId,decision} = processAplicationDTO
const applicationExist = await this.applicationRepository.FindOne({_id:applicationId,jobId,companyId,status:ApplicationStatus.Pending},{applicantEmail:1})
if(!applicationExist)
{
  throw new NotFoundException("No Application Found")
}
// the idea was it will be under review if ther was an ATS but for now i will skipp this part to be manual 
const newStatus = decision ? ApplicationStatus.Under_Interview : ApplicationStatus.Rejected

const result = await this.applicationRepository.UpdateOne({_id:applicationId,jobId,companyId},{status:newStatus})
if(!result)throw new InternalServerErrorException("Error Updateing")


if(decision)
{
const constructedInterview = this.hrFactory.CreateInterview(jobId,companyId,applicationId)
const creatingResult = await this.interviewRepository.CreatDocument(constructedInterview)
if(!creatingResult)
{
    await this.applicationRepository.UpdateOne({_id:applicationId,jobId,companyId},{status:ApplicationStatus.Pending})
    throw new InternalServerErrorException("Error creating Interview")
}
await this.applicationRecordRepository.UpdateOne({applicationId:applicationId},{$set:{applicationOutcome:true,processedAt:new Date()}})
await this.employeeActionRepository.RecordAction(hrId,HrActionsTypes.ProcessApplication)
}
else 
{
await Promise.allSettled(
[
this.applicationRecordRepository.UpdateOne({applicationId:applicationId},{$set:{applicationOutcome:false,processedAt:new Date()}}),
this.employeeActionRepository.RecordAction(hrId,HrActionsTypes.ProcessApplication),
this.mailService.sendCustomMail(
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
)
])
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

async ScheduleInterview(interviewId:Types.ObjectId,companyId:Types.ObjectId,interviewDTO:InterviewDTO,hrId:Types.ObjectId) 
{
 const {interviewDate,interviewTime} = interviewDTO

  const [interviewExist,Interview] = await Promise.all(
  [
   this.interviewRepository.Exist({_id:interviewId,companyId}),
   this.interviewRepository.GetInterviewDetails(interviewId,companyId),
  ])

  if(!interviewExist)throw new NotFoundException("No interview Found")
  if(Interview.status == ApplicationStatus.Under_Interview)throw new ConflictException("Interview is already scheduled");
 


  const updateResult = await this.interviewRepository.UpdateOne({_id:interviewId,companyId},{$set:{status:ApplicationStatus.Under_Interview,interviewDate:interviewDate,interviewTime:interviewTime}})
  if(!updateResult)throw new InternalServerErrorException("Error Upadting")
  
   
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
  const application = await this.applicationRepository.FindOne({_id:Interview.applicationId})
  if(!application)
  {
    await this.interviewRepository.DeleteOne({_id:interviewId})
    throw new ConflictException("Application dont exist")
  }
  const interviewRecord:InterviewRecordEntity = 
  {
  companyId:companyId,
  applicantId:application.applicantId,
  jobId:application.jobId,
  interviewId:Interview._id,
  applicationId:application._id
  }

  await Promise.allSettled(
  [
  this.employeeActionRepository.RecordAction(hrId,HrActionsTypes.SetInterview),
  this.interviewRecordRepository.AddRecord(interviewRecord)
  ])

 return true
}

async InterviewOutcome(interviewId:Types.ObjectId,companyId:Types.ObjectId,hrId:Types.ObjectId,decision:boolean)
{
const intrviewExist = await this.interviewRepository.FindOne({_id:interviewId,companyId:companyId})
if(!intrviewExist)throw new InternalServerErrorException("No interviewfound")
if(intrviewExist.status == ApplicationStatus.Accepted || intrviewExist.status ==  ApplicationStatus.Rejected)throw new ConflictException("The interview had been processed before")
if(intrviewExist.status != ApplicationStatus.Under_Interview)throw new ConflictException("The InterviewDate should be set first")

const interviewDateTime = new Date(`${intrviewExist.interviewDate?.toString()}T${intrviewExist.interviewTime}:00`);

if (new Date() < interviewDateTime) throw new ConflictException( "Processing must happen after the interview date and time");

const newStatus = decision ? ApplicationStatus.Accepted :ApplicationStatus.Rejected

const updatingResult = await this.interviewRepository.UpdateOne({_id:interviewId,companyId},{$set:{status:newStatus}})
if(!updatingResult)throw new InternalServerErrorException("Error updating")

const updateapplicationResult = await this.applicationRepository.UpdateOne({_id:intrviewExist.applicationId},{$set:{status:newStatus}})
if(! updateapplicationResult)throw new InternalServerErrorException("Error updating")

await Promise.allSettled(
[
this.employeeActionRepository.RecordAction(hrId,HrActionsTypes.ProcessInterview),
this.interviewRecordRepository.UpdateOne({companyId,interviewId},{$set:{interviewOutcome:decision,completedAt:new Date()}})
])
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

async DeleteJob(jobId:Types.ObjectId,companyId:Types.ObjectId,hrId:Types.ObjectId)
{
const [jobExist,applicationsExist,InterviewsExist] = await Promise.all(
[
 this.jobRepository.Exist({_id:jobId,companyId}),
 this.applicationRepository.Find({jobId,companyId,status:ApplicationStatus.Pending}),
 this.interviewRepository.Find({jobId,companyId,$or:[{status:ApplicationStatus.Pending},{status:ApplicationStatus.Under_Interview}]})
])

if(!jobExist)throw new NotFoundException("No job found")
if(applicationsExist)throw new ConflictException('This job cannot be deleted because there are pending applications.')
if(InterviewsExist)throw new ConflictException('This job cannot be deleted because there are pending or under going Interviews.')


try 
{
  await Promise.all(
  [
   this.jobRepository.DeleteOne({_id:jobId,companyId}),
   this.applicationRepository.DeleteMany({jobId,companyId}),
   this.interviewRepository.DeleteMany({jobId,companyId}),
   this.savedPostsRepository.DeleteMany({jobId})
  ])
}
 catch (error) 
{
 throw new InternalServerErrorException(`Deleteing failed ${error.message}`)
} 
await this.employeeActionRepository.RecordAction(hrId,HrActionsTypes.DeleteJob)
return true
}

async AllApplicationsPerJob(companyId:Types.ObjectId,jobId:Types.ObjectId)
{
const job = await this.jobRepository.FindOne({_id:jobId,companyId})
if(!job) throw new NotFoundException("No Job Found")
if(job.ApplicationsCount == 0) return {
  pendingApplications:[],
  applicationsUnderInterview:[],
  completedApplications:[],
  _id:jobId
}
  

const data = await this.applicationRepository.AllApplicationsPerJob(companyId,jobId)
return data
}

async AllJobswithApplications(companyId:Types.ObjectId,page:number,limit:number)
{
const data = await this.jobRepository.AllJobsWithApplications(companyId,page,limit)
return data
}

}
