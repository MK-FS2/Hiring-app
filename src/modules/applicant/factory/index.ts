import { Injectable } from "@nestjs/common";
import { EducationEntity } from "../entity";
import { EducationDTO, UpdateEducationDTO } from "../dto";

@Injectable()
export class ApplicantFactory 
{

AddEducation(educationDTO:EducationDTO)
{
const education = new EducationEntity()
education.degree = educationDTO.degree
education.institution = educationDTO.institution
education.startDate = educationDTO.startDate
education.endDate = educationDTO.endDate

return education 
}

UpdateEducation(updateEducationDTO:UpdateEducationDTO)
{
const education  = new EducationEntity()
if(updateEducationDTO.degree)
{
    education.degree = updateEducationDTO.degree
}
if(updateEducationDTO.institution)
{
  education.institution = updateEducationDTO.institution  
}
if(updateEducationDTO.startDate)
{
  education.startDate = updateEducationDTO.startDate  
}
if(updateEducationDTO.endDate)
{
  education.endDate = updateEducationDTO.endDate
}

return education
}
}