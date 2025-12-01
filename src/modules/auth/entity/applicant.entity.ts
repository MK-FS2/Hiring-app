import { BaseUserEntity } from "./baseuser.entity";
import { IndustriesFeilds } from "@Shared/Enums";



export class ApplicantEntity extends BaseUserEntity 
{
industry: IndustriesFeilds;
titel: string;
}