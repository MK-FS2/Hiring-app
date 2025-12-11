import { ApplicantFactory } from './factory/index';
import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { FileData, FullGuard, UserData } from '@Shared/Decorators';
import { Degrees, Filecount, IndustriesFeilds, Roles } from '@Shared/Enums';
import { SkillDTO, EducationDTO, UpdateEducationDTO, CvDTO, CoverLetterDTO, DescriptionDTO } from './dto';
import { Types } from 'mongoose';
import { ValidMongoID } from '@Shared/Pipes';
import { FilesInterceptor } from '@Shared/Interceptors';
import { FileTypes } from '@Shared/Helpers';
import { EducationSchema } from '@Models/Users';
import { JobQueryParameters } from '@Shared/Interfaces';


@FullGuard(Roles.Applicant)
@Controller('applicant')
export class ApplicantController 
{
  constructor(private readonly applicantService: ApplicantService,
    private readonly applicantFactory:ApplicantFactory
  ){}


@Post("addEducation")
 async AddEducation(@Body()educationDTO:EducationDTO,@UserData("_id")applicantId:Types.ObjectId)
 {
  const education = this.applicantFactory.AddEducation(educationDTO)

  const Result = await this.applicantService.AddEducation(education,applicantId)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:"Added education Successfully",status:200}
 }

@Put("updatingEducation/:educationId")
async updatingEducation(@Body()updateEducationDTO:UpdateEducationDTO,@UserData("_id")applicantId:Types.ObjectId,@Param("educationId",ValidMongoID)educationId:Types.ObjectId)
{
const education =  this.applicantFactory.UpdateEducation(updateEducationDTO)

const Result = await this.applicantService.UpdateEducation(education,applicantId,educationId)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:"Updated education Successfully",status:200}
}


@Delete("deleteEducation/:educationId")
async DeleteEducation(@Param("educationId",ValidMongoID)educationId:Types.ObjectId,@UserData("_id")aplicantId:Types.ObjectId)
{
const Result = await this.applicantService.RemoveEducation(educationId,aplicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Removed education Successfully",status:200}
}


@Post("addSkill")
async AddNewSkill(@Body()skillDTO:SkillDTO,@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.AddSkill(applicantId,skillDTO)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Skill added Successfully",status:200}
}

@Delete("removeSkill")
async RemoveSkill(@Body()skillDTO:SkillDTO,@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.RemoveSkill(applicantId,skillDTO)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Skill removed Successfully",status:200}
}

@Post("addCertification")
@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:2*1024*1024,FileType:FileTypes.Image,FieldName:'certification'}]))
async addCertification(@UserData("_id")applicantId:Types.ObjectId,@FileData({filecount:Filecount.File,fieldname:"certification",optional:false})certificationImage:Express.Multer.File)
{
const Result = await this.applicantService.AddCertification(applicantId,certificationImage)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"certification Added Successfully",status:200}
}

@Delete("removeCertification/:certificationId")
async RemoveCertification(@UserData("_id")applicantId:Types.ObjectId,@Param("certificationId",ValidMongoID)certificationId:Types.ObjectId)
{
const Result = await this.applicantService.RemoveCertification(applicantId,certificationId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"certification Removed Successfully",status:200}
} 

@Post("addCv")
@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:2*1024*1024,FileType:FileTypes.Document,FieldName:'cv'}]))
async AddCv(@UserData("_id")applicantId:Types.ObjectId,@Body()cvDTO:CvDTO,@FileData({filecount:Filecount.File,fieldname:"cv",optional:false})CVFile:Express.Multer.File)
{
const Result = await this.applicantService.AddCV(cvDTO,CVFile,applicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Cv Added Successfully",status:200}
}

@Delete("removeCv/:cvId")
async RemoveCv(@Param("cvId",ValidMongoID)cvId:Types.ObjectId,@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.RemoveCv(cvId,applicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Cv Removed Successfully",status:200}
}

@Post("setCoverLetter")
async SettingCoverLetter(@Body()coverLetterDTO:CoverLetterDTO,@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.SettingCoverLetter(coverLetterDTO,applicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}


@Post("setDescription")
async SettinDescription(@Body()descriptionDTO:DescriptionDTO,@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.SettingDescription(descriptionDTO,applicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Description Added Successfully",status:200}
}


@Put("toggleAvailability")
async ToggleAvilability(@UserData("_id")applicantId:Types.ObjectId)
{
const Result = await this.applicantService.ToggleAvailability(applicantId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Description Added Successfully",status:200}
}

@Get("applicantJobs")
async GetApplicantJobs(
@Query("page",ParseIntPipe)page:number=1,
@Query("limit",ParseIntPipe)limit:number=10,
@UserData("skills")applicantSkills:string[],
@UserData("education")education:EducationSchema[],
@UserData("industry")applicantIndustry:IndustriesFeilds)
{
 let applicanDegrees: Degrees[] = [];
 if(education.length > 0 )
 {
  applicanDegrees = education.map((ed)=> ed.degree)
 }

const queryParameters:JobQueryParameters = 
{
  page:page,
  limit:limit,
  jobTitle:"",
  experienceLevel: undefined,
  maxYear: undefined,
  minYear: undefined,
  city: "",
  country: "",
  workplaceType: undefined,
  minSalary: 0,
  maxSalary: 0,
};
  const Data = await this.applicantService.GetJobs(applicantIndustry,applicanDegrees,applicantSkills,queryParameters)
  return Data 
}

}


