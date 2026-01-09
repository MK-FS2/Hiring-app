import { BaseUserEntity } from "./baseuser.entity";
import { CarerExperienceLevels, IndustriesFeilds } from "@Shared/Enums";



export class ApplicantEntity extends BaseUserEntity 
{
industry: IndustriesFeilds;
titel: string;
carerLevel:CarerExperienceLevels
}