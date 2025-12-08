import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { EducationEntity } from './entity';
import { Types } from 'mongoose';
import { ApplicantRepository } from '@Models/Users';

@Injectable()
export class ApplicantService 
{

constructor(private readonly applicantRepository:ApplicantRepository){}


async AddEducation(education:EducationEntity,applicantId:Types.ObjectId)
{
const applicantExist = await this.applicantRepository.Exist({_id:applicantId})
if(!applicantExist)
{
throw new NotFoundException("No user found")
}
//  i am aware this isnt the best practise and it negate the separation of concerns but i am having a hard time with clss validator cross field validation
if(new Date(education.startDate) > new Date(education.endDate))
{
throw new BadRequestException("End date cannot be earlier than start date")
}

const addingResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$push:{education}})
if(!addingResult)
{
    throw new InternalServerErrorException("Error creating")
}
return true
}


async UpdateEducation(education:EducationEntity,applicantId:Types.ObjectId,educationId:Types.ObjectId)
{

if(!education.degree && !education.institution && !education.startDate && !education.endDate)
{
    throw new BadGatewayException("One fild at lest is required")
}

const applicantExist = await this.applicantRepository.FindOne({_id:applicantId},{education:1})
if(!applicantExist)
{
throw new NotFoundException("No user found")
}

const educationExist = await this.applicantRepository.FindOne({_id:applicantId,"education._id":educationId},{"education.$":1})
if(!educationExist)
{
throw new NotFoundException("No education found")
}

const oldEducation = educationExist?.education![0]

if (education.startDate && education.endDate) 
{
  if (new Date(education.startDate) > new Date(education.endDate)) 
  {
    throw new BadRequestException('End date cannot be earlier than start date');
  }
}

if (education.startDate) 
{
  if (new Date(education.startDate) > new Date(oldEducation.endDate)) 
  {
    throw new BadRequestException('End date cannot be earlier than start date');
  }
}

if (education.endDate) 
{
  if (new Date(oldEducation.startDate) > new Date(education.endDate)) 
  {
    throw new BadRequestException('End date cannot be earlier than start date');
  }
}

const newEducation = new EducationEntity();
newEducation.degree = education.degree ?? oldEducation.degree;
newEducation.institution = education.institution ?? oldEducation.institution;
newEducation.startDate = education.startDate ?? oldEducation.startDate;
newEducation.endDate = education.endDate ?? oldEducation.endDate;


const updateResult = await this.applicantRepository.UpdateOne({_id:applicantId,"education._id":educationId},{$set:{"education.$":newEducation}})
if(!updateResult)
{
throw new InternalServerErrorException("Error updating")
}
return true
}

async RemoveEducation(educationId:Types.ObjectId,applicantId:Types.ObjectId)
{
const educationExis = await this.applicantRepository.Exist({_id:applicantId,"education._id":educationId})
if(!educationExis)
{
 throw new NotFoundException("No education found")
}
const deletionResult = await this.applicantRepository.UpdateOne({ _id: applicantId },{$pull:{education:{_id:educationId}}});
if(!deletionResult)
{
 throw new InternalServerErrorException("Error Deleting")
}
return true
}
}
