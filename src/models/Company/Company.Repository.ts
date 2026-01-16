/* eslint-disable @typescript-eslint/no-unsafe-return */
import AbstractRepository from "@Models/AbstractRepository";
import { Company } from "./Company.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";




@Injectable()
export class CompanyRepository extends AbstractRepository<Company> 
{
constructor(@InjectModel(Company.name) private readonly CompanyModel:Model<Company>)
{
super(CompanyModel)
}

async UnconfirmedCompanies(page:number,limit:number)
{
const skip = Math.ceil((page-1)*limit)

const data = await this.CompanyModel.aggregate(
[
{$match:{approvedByAdmin:false}},
{
$facet:
{
companies:
[
{$sort:{createdAt:1}},
{$skip:skip},
{$limit:limit},
{$project:{__v:0,companycodes:0,updatedAt:0,Hrs:0,"logo._id":0,"coverPic._id":0,"logo.ID":0,"coverPic.ID":0,"legalDocuments._id":0,"legalDocuments.ID":0}}
],
metadata:
[
{
$group:
{
  _id:null,
  totalUnApprovedCompanies:{$sum:{$cond:[{$eq:["$approvedByAdmin",false]},1,0]}},
  totalApprovedCompanies:{$sum:{$cond:[{$eq:["$approvedByAdmin",true]},1,0]}}, 
}
},
{$project:{_id:0}}
]
}
}
])
return data
}

async AllBannedCompanies(page:number,limit:number,companyName?:string)
{
const skip = Math.ceil((page-1)*limit)
const filter:any= {isbanned:true}
  if (companyName)
     {
    filter.companyname = 
    {
      $regex: companyName,
      $options: 'i',
    };
  }

const companies = await this.CompanyModel.aggregate([
  { $match: filter },
  {
    $facet: {
      data: [
        {
          $project: 
          {
            createdA: 0,
            Hrs: 0,
            "legalDocuments._id":0,
            "legalDocuments.ID":0,
            "coverPic.ID":0,
            "coverPic._id":0,
            "logo.ID":0,
            "logo._id":0,
            createdby: 0,
            companycodes: 0,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ],
      meta: [
        { $count: 'totalBannedJobs' },
      ],
    },
  },
]);
return companies
}


}