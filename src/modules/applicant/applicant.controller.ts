import { ApplicantFactory } from './factory/index';
import { Body, Controller, DefaultValuePipe, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { FileData, FullGuard, UserData } from '@Shared/Decorators';
import { CarerExperienceLevels,Filecount, Genders, IndustriesFeilds, Roles, WorkplaceTypes } from '@Shared/Enums';
import { SkillDTO, EducationDTO, UpdateEducationDTO, CvDTO, CoverLetterDTO, DescriptionDTO} from './dto';
import { Types } from 'mongoose';
import { ValidMongoID, ValidStringPipe } from '@Shared/Pipes';
import { FilesInterceptor } from '@Shared/Interceptors';
import { FileTypes } from '@Shared/Helpers';
import { applicantData, JobQueryParameters } from '@Shared/Interfaces';
import { AppliedBefore } from '@Shared/Guards';


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
@UserData("industry")applicantIndustry:IndustriesFeilds,
@UserData("carerLevel")applicantCarerLevel:CarerExperienceLevels,
@Query("page",ParseIntPipe) page: number=1,
@Query("limit",ParseIntPipe) limit: number=10,
@Query("jobTitle") jobTitle?:string,
@Query("experienceLevel") experienceLevel?:CarerExperienceLevels,
@Query("maxYear") maxYear?: number,
@Query("minYear") minYear?: number,
@Query("city") city?: string,
@Query("country") country?: string,
@Query("workplaceType") workplaceType?: WorkplaceTypes,
@Query("minSalary") minSalary?: number,
@Query("maxSalary") maxSalary?: number,
)
{

  const queryParameters: JobQueryParameters = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    jobTitle: jobTitle ?? "",
    experienceLevel: experienceLevel as any,
    maxYear: maxYear ? Number(maxYear) : undefined,
    minYear: minYear ? Number(minYear) : undefined,
    city: city ?? "",
    country: country ?? "",
    workplaceType: workplaceType as any,
    minSalary: minSalary ? Number(minSalary) : undefined,
    maxSalary: maxSalary ? Number(maxSalary) :undefined
  };
  const Data = await this.applicantService.GetJobs(applicantIndustry,applicantCarerLevel,queryParameters)
  return Data 
}

@Get("getJobDetails/:jobId")
async GetJobDetails(@Param("jobId",ValidMongoID)jobId:Types.ObjectId)
{
const Data = this.applicantService.GetJobDetails(jobId)
return Data
}


@Get("companyJobs/:companyId")
async GetCompanyJobs(@Param("companyId",ValidMongoID)companyId:Types.ObjectId,@Query("page",new DefaultValuePipe(1),ParseIntPipe)page:number,@Query("limit",new DefaultValuePipe(1),ParseIntPipe)limit:number)
{
const Data = await this.applicantService.GetcompanyJobs(companyId,page,limit)
return Data
}


@Get("searchCompany/:companyName")
async SearchCompany(@Param("companyName",new ValidStringPipe(1,100))companyName:string)
{
const Data = await this.applicantService.SearchCompany(companyName)
return Data
}

@Post("jobApplication/:jobId")
@UseGuards(AppliedBefore)
@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Document,FieldName:'CV'}]))
async ApplyforJob(
@UserData("_id")applicantId:Types.ObjectId,
@UserData("firstName")firstName:string,
@UserData("lastName")lastName:string,
@UserData("gender")gender:Genders,
@UserData("email")email:string,
@UserData("phoneNumber")phoneNumber:string,
@UserData("industry")applicantIndustry:IndustriesFeilds,
@UserData("carerLevel")applicantCarerLevel:CarerExperienceLevels,
@Param("jobId",ValidMongoID)jobId:Types.ObjectId,
@FileData({optional:false,fieldname:"CV",filecount:Filecount.File})CVFile:Express.Multer.File
)
{
 const applicantData:applicantData=
 {
  applicantEmail:email,
  applicantName:firstName+"-"+lastName,
  applicantgender:gender,
  applicantPhone:phoneNumber,
  applicantId:applicantId,
  applicantIndustry:applicantIndustry,
  applicantCarerLevel:applicantCarerLevel
 }

const Result = await this.applicantService.JobApplication(jobId,CVFile,applicantData)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Applyed Successfully",status:200}
}


@Get("applications")
async GetApplications(@UserData("_id")applicantId:Types.ObjectId)
{
const Data = await this.applicantService.GetApplications(applicantId)
return Data
}

@Post("ToggleSavePost/:jobId")
async SavingPost(@Param("jobId",ValidMongoID)jobId:Types.ObjectId,@UserData("_id")userId:Types.ObjectId)
{
const Result = await this.applicantService.ToggleSaveJobPost(jobId,userId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Toggled Successfully",status:200}
}


@Get("Allsavedposts")
async GetAllSavedPosts(@UserData("_id")userId:Types.ObjectId)
{
const Data = await this.applicantService.GetAllSavedPosts(userId)
return Data
}
}


