/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from "@Models/AbstractRepository";
import { Interview } from "./interviewSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";



export class InterviewRepository extends AbstractRepository<Interview>
{
constructor(@InjectModel(Interview.name)private readonly InterviewModel:Model<Interview>)
{
super(InterviewModel)
}


async GetjobInterviewList(companyId:Types.ObjectId,skip:number,limit:number)
{

 const jobs = await this.InterviewModel.aggregate([
  { $match: { companyId } },

  {$group: 
   {
    _id:"$jobId",
    TotalInterviews:{$sum:1},
     ProcessedInterviews: 
     {
     $sum:{$cond:[{$in:["$status",["Accepted","Rejected"]]},1,0]}
     }
    }
  },
  {
    $project: 
    {
     jobId:"$_id",
     _id:0,
     TotalInterviews:1,
     ProcessedInterviews:1,
     progress: {$cond:[{$eq:["$TotalInterviews",0]},0,{$multiply:[{ $divide:["$ProcessedInterviews","$TotalInterviews"]},100]}]}
    }
  },
{ 
$lookup: 
{ 
from:"jobs", 
localField:"jobId", 
foreignField:"_id", 
as:"jobDetails" 
}},
{$unwind:"$jobDetails"},
{
$project:{
jobId:1,
TotalInterviews:1,
ProcessedInterviews: 1,
jobTitle:"$jobDetails.title",
createdAt:"$jobDetails.createdAt"
}},
{$skip:skip},
{$limit:limit}
]);

 return jobs
}

async GetInterviewDetails(interviewId: Types.ObjectId, companyId: Types.ObjectId) {
  const interview = await this.InterviewModel.aggregate([
    { $match: { companyId, _id: interviewId } },
    {
      $lookup: {
        from: "applications",
        localField: "applicationId",
        foreignField: "_id",
        as: "ApplicationData",
        pipeline: [
          { $project: { applicantEmail: 1, applicantName: 1, _id: 0 } }
        ]
      }
    },
    { $unwind: "$ApplicationData"},  
    {
      $addFields:
      {
        applicantEmail: "$ApplicationData.applicantEmail",  
        applicantName: "$ApplicationData.applicantName"     
      }
    },
    {
      $project: { ApplicationData: 0, companyId: 0 ,__v:0}
    }
  ]);

  if (!interview || interview.length === 0) 
  {
    throw new NotFoundException("Interview not found");
  }

  return interview[0];  
}



}