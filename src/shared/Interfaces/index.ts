import { JwtPayload } from "jsonwebtoken"

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