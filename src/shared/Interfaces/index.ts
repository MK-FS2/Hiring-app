import { Genders, IndustriesFeilds } from "@Shared/Enums"
import { JwtPayload } from "jsonwebtoken"
import { Types } from "mongoose"

export interface ITokenPayload extends JwtPayload
{
id:string
FullName:string
Email:string
Role:string
}

export interface JobQueryParameters 
{
  page: number;
  limit: number;
  jobTitle?: string;
  experienceLevel?: string;
  maxYear?: number;
  minYear?: number;
  city?: string;
  country?: string;
  workplaceType?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface applicantData 
{
 applicantName:string
 applicantEmail:string
 applicantPhone:string
 applicantgender:Genders
 applicantId:Types.ObjectId
 applicantIndustry:IndustriesFeilds
}