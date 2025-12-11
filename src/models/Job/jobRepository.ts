import AbstractRepository from "@Models/AbstractRepository";
import { Job } from "./jobSchema";
import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument, Model} from "mongoose";
import { Degrees, IndustriesFeilds, JobStatus } from "@Shared/Enums";
import { JobQueryParameters } from "@Shared/Interfaces";




export class JobRepository extends AbstractRepository<Job>
{
    constructor(@InjectModel(Job.name) private readonly JobModel:Model<Job>)
    {
        super(JobModel)
    }

 async ApplicantJobsDefault(applicantIndustry:IndustriesFeilds,applicantDegrees:Degrees[],applicantSkills:string[],queryParameters:JobQueryParameters)
{
// This abomination of a query is to bypass ReferenceError by converting a dynamic variable 
// (in this example, `applicantSkills`) to a string so that $where can accept it. 
// It allows running a primitive recommendation criteria: selecting jobs with at least 75% skill match,
// either in the same industry or outside the industry.

let jobs: HydratedDocument<Job>[] | null = null;

const { page, limit, jobTitle, experienceLevel, maxYear, minYear, city, country, workplaceType, minSalary, maxSalary} = queryParameters;
const skip = (page - 1) * limit;

const projection = {requirements:0,description:0,currency:0,minYears:0,maxYears:0,maxSalary:0,minSalary:0,city:0,country:0,createdBy:0,updatedBy:0,createdAt:0,isActive:0,deadline:0,status:0,mangerAlert:0,hrAlert:0,hrAlertNote:0,__v:0}
const options = {skip:skip,limit:limit,populate:{path:"companyId",select:"companyname _id logo"}}
const filters: any[] = [];

if (jobTitle) filters.push({ title: { $regex: jobTitle, $options: "i" } });
if (experienceLevel) filters.push({ experienceLevel }); 
if (minYear !== undefined) filters.push({ minYears: { $gte: minYear } });
if (maxYear !== undefined) filters.push({ maxYears: { $lte: maxYear } });
if (city) filters.push({ city: { $regex: city, $options: "i" } });
if (country) filters.push({ country: { $regex: country, $options: "i" } });
if (workplaceType) filters.push({ workplaceType });
if (minSalary) filters.push({ minSalary: { $gte: minSalary } });
if (maxSalary) filters.push({ maxSalary: { $lte: maxSalary } });

if(applicantSkills.length > 0)
{
 const applicantSkillsStr = JSON.stringify(applicantSkills.map(s => s.toUpperCase()));
  jobs = await this.Find({
  $and:[
     ...filters,
    { isActive: true },
    { degree: { $in: applicantDegrees } },
    { status: JobStatus.Open },
    {
      $or: [{$and:[{industry:applicantIndustry},
            {
              $where: `function() {
                const jobSkills = this.skills.map(s => s.toUpperCase());
                const applicantSkills = ${applicantSkillsStr};
                const matches = jobSkills.filter(s => applicantSkills.includes(s)).length;
                const similarity = (matches / jobSkills.length) * 100;
                return similarity >= 75;
              }`
            }
          ]
        },
        {
          $and:[{industry:{$ne:applicantIndustry}},
            {
              $where: `function() {
                const jobSkills = this.skills.map(s => s.toUpperCase());
                const applicantSkills = ${applicantSkillsStr};
                const matches = jobSkills.filter(s => applicantSkills.includes(s)).length;
                const similarity = (matches / jobSkills.length) * 100;
                return similarity >= 75;
              }`
            }
          ]
        }
      ]
    }
  ]
},projection,options);
}
else 
{
jobs = await this.Find({$and:[{industry:applicantIndustry},{degree:{$in:applicantDegrees}},...filters]},projection,options)
}


 
    if(!jobs)
    {
        return []
    }
    else 
    {
        return jobs
    }
  }


}