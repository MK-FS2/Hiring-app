import { Injectable } from "@nestjs/common";
import { EducationEntity, JobApplicationEntity } from "../entity";
import { EducationDTO,UpdateEducationDTO } from "../dto";
import { applicantData } from "@Shared/Interfaces";
import { FileSchema } from '@Models/common';
import { Types } from "mongoose";

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

createJobApplication(jobId:Types.ObjectId,companyId:Types.ObjectId,applicantData:applicantData,CvSchema:FileSchema)
{
const application =  new JobApplicationEntity()

application.applicantEmail = applicantData.applicantEmail
application.applicantName = applicantData.applicantName
application.applicantPhone = applicantData.applicantPhone
application.applicantGender = applicantData.applicantgender
application.applicantId = applicantData.applicantId
application.companyId = companyId
application.jobId =jobId
application.cv = CvSchema

return application
}

}