import { InterviewRecord } from "@Models/Statistics/InterviewStatistics";
import { Types } from "mongoose";



export class InterviewRecordEntity implements InterviewRecord
{
applicantId:Types.ObjectId;
interviewId:Types.ObjectId
applicationId:Types.ObjectId;
jobId:Types.ObjectId;
companyId:Types.ObjectId;
}