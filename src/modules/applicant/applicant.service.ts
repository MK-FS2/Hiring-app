import { JobRepository } from './../../models/Job/jobRepository';
import { BadGatewayException, BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { EducationEntity } from './entity';
import { Types } from 'mongoose';
import { ApplicantRepository } from '@Models/Users';
import { CoverLetterDTO, CvDTO, DescriptionDTO, SkillDTO } from './dto';
import { CloudServices } from '@Shared/Utils/Cloud';
import { Degrees, FolderTypes, IndustriesFeilds} from '@Shared/Enums';
import { JobQueryParameters } from '@Shared/Interfaces';


@Injectable()
export class ApplicantService 
{

constructor(
private readonly applicantRepository:ApplicantRepository,
 private readonly cloudServices:CloudServices,
 private readonly jobRepository:JobRepository
){}


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

async AddSkill(applicantId:Types.ObjectId,skillDTO:SkillDTO)
{
const result = await this.applicantRepository.UpdateOne({_id:applicantId},{$addToSet:{skills:skillDTO.skill.toUpperCase()}})
if(!result)
{
 throw new InternalServerErrorException("Error Adding")
}
return true
}

async RemoveSkill(applicantId:Types.ObjectId,skillDTO:SkillDTO)
{
const applicantInfo = await this.applicantRepository.FindOne({_id:applicantId,"skills":skillDTO.skill.toUpperCase()},{"skills.$":1})
if(!applicantInfo)
{
    throw new NotFoundException("Skill doesn't exist")
}

const deletionResult = await this.applicantRepository.UpdateOne({_id:applicantId,"skills":skillDTO.skill.toUpperCase()},{$pull:{skills:skillDTO.skill.toUpperCase()}})
if(!deletionResult)
{
    throw new InternalServerErrorException("Error Deleting")
}
return true
}

async AddCertification(applicantId:Types.ObjectId,certificationImage:Express.Multer.File)
{
const folder = `${FolderTypes.App}/${FolderTypes.Users}/${applicantId.toString()}/${FolderTypes.Documents}`  
const uploadResult = await this.cloudServices.uploadOne(certificationImage.path,folder)
if(!uploadResult)
{
    throw new InternalServerErrorException("Error Uploading")
}

const updatingResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$push:{certifications:uploadResult}})
if(!updatingResult)
{
    await this.cloudServices.DeleteFile(uploadResult.ID)
    throw new InternalServerErrorException("Error Updating")
}
return true
}

async RemoveCertification(applicantId: Types.ObjectId, certificationId: Types.ObjectId) {
  const certificationExist = await this.applicantRepository.FindOne({ _id: applicantId,"certifications._id": certificationId},{"certifications.$":1});

  if (!certificationExist) 
  {
    throw new NotFoundException("Certification doesn't exist");
  }

  const certificationDoc = certificationExist.certifications![0];
  const certificationImageId: string = certificationDoc.ID;

  const deleteDbResult = await this.applicantRepository.UpdateOne({_id:applicantId },{$pull:{certifications:{_id:certificationId}}});

  if (!deleteDbResult) 
  {
    throw new InternalServerErrorException("Error deleting certification");
  }

  const deleteImageResult = await this.cloudServices.DeleteFile(certificationImageId);
  if (!deleteImageResult) 
  {
    await this.applicantRepository.UpdateOne({_id:applicantId},{$push:{certifications:certificationDoc}});
    throw new InternalServerErrorException("Error deleting certification image");
  }

  return true;
}

async AddCV(cvDTO:CvDTO,CvFile:Express.Multer.File,applicantId:Types.ObjectId)
{
const applicant = await this.applicantRepository.FindOne({_id:applicantId},{CVS:1});

if (applicant?.CVS?.length== 3) 
{
  throw new ConflictException("You can only have a maximum of 3 CVs");
}

const folder = `${FolderTypes.App}/${FolderTypes.Users}/${applicantId.toString()}/${FolderTypes.Documents}`  
const uploadResult = await this.cloudServices.uploadOne(CvFile.path,folder)
if(!uploadResult)
{
    throw new InternalServerErrorException("Error Uploadong")
}

const CvObject =
{
cvName:cvDTO.cvName,
cvFile:uploadResult
}

const updateResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$push:{CVS:CvObject}})
if(!updateResult)
{
 await this.cloudServices.DeleteFile(uploadResult.ID)
 throw new InternalServerErrorException("Error")
}
return true
}

async RemoveCv(CvId:Types.ObjectId,applicantId:Types.ObjectId)
{

  const CvExist = await this.applicantRepository.FindOne({_id:applicantId,"CVS._id":CvId},{"CVS.$":1})
  if(!CvExist)
  {
    throw new NotFoundException("No CV Found")
  }

  const cvImageId = CvExist.CVS![0].cvFile.ID

  const deleteDbResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$pull:{CVS:{_id:CvId}}})
  if(!deleteDbResult)
  {
    throw new InternalServerErrorException("Error Deleting")
  }

  const deleteImageResult = await this.cloudServices.DeleteFile(cvImageId)
  if(!deleteImageResult)
  {
    await this.applicantRepository.UpdateOne({_id:applicantId},{$push:{CVS:CvExist.CVS![0]}})
    throw new InternalServerErrorException("Error Deleting")
  }

  return true
}


// it add,replace or delet 
async SettingCoverLetter(coverLetterDTO:CoverLetterDTO,applicantId:Types.ObjectId)
{
if(coverLetterDTO.CoverLetter)
{
const actionResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$set:{coverLetter:coverLetterDTO.CoverLetter}})
if(!actionResult)throw new InternalServerErrorException("Error Setting")
}
else 
{
const actionResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$unset:{coverLetter:""}})
if(!actionResult)throw new InternalServerErrorException("Error Setting")
}

return true
}


async SettingDescription(descriptionDTO:DescriptionDTO,applicantId:Types.ObjectId)
{
if(descriptionDTO.description)
{
  const addingResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$set:{description:descriptionDTO.description}})
if(!addingResult)throw new InternalServerErrorException("Error Setting")
}
else 
{
  const addingResult = await this.applicantRepository.UpdateOne({_id:applicantId},{$unset:{description:""}})
if(!addingResult)throw new InternalServerErrorException("Error Setting")
}
return true
}


async ToggleAvailability(applicatId:Types.ObjectId)
{
const oldAvailability = await this.applicantRepository.FindOne({_id:applicatId},{availability:1})
if(oldAvailability?.availability == true)
{
  const togglingResult = await this.applicantRepository.UpdateOne({_id:applicatId},{$set:{availability:false}})
  if(!togglingResult) throw new InternalServerErrorException("Error Updating")
}
else 
{
 const togglingResult = await this.applicantRepository.UpdateOne({_id:applicatId},{$set:{availability:true}})
  if(!togglingResult) throw new InternalServerErrorException("Error Updating") 
}
return true
}


async GetJobs(applicantIndustry: IndustriesFeilds,applicantdegrees:Degrees[],applicantSkills:string[],queryParameters:JobQueryParameters) 
{

 const jobs = await this.jobRepository.ApplicantJobsDefault(applicantIndustry,applicantdegrees,applicantSkills,queryParameters)
 return jobs

}


}
