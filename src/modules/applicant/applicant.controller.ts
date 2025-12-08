import { ApplicantFactory } from './factory/index';
import { Body, Controller, Delete, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { FullGuard, UserData } from '@Shared/Decorators';
import { Roles } from '@Shared/Enums';
import { EducationDTO, UpdateEducationDTO } from './dto';
import { Types } from 'mongoose';
import { ValidMongoID } from '@Shared/Pipes';


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


}


