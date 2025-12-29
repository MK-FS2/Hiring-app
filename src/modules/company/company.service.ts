import { HydratedDocument } from 'mongoose';
import { JobRepository } from './../../models/Job/jobRepository';
import { CloudServices } from '@Shared/Utils/Cloud';
import { MangerRepository } from '@Models/Users';
import { ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCompanyEntity } from './entity';
import { CompanyRepository } from '@Models/Company';
import { CompanyImageFlag, FolderTypes, JobStatus, Roles } from '@Shared/Enums';
import { FileSchema } from '@Models/common';
import { Job } from '@Models/Job';
import { CompanyReportsRepository} from '@Models/companyReports';


@Injectable()
export class CompanyService 
{
constructor(private readonly companyRepository:CompanyRepository,
private readonly mangerRepository:MangerRepository,
private readonly cloudServices:CloudServices,
private readonly jobRepository:JobRepository,
private readonly companyReportsRepository:CompanyReportsRepository
){}



async CreateCompany(company:CreateCompanyEntity,userid:Types.ObjectId,logo:Express.Multer.File,coverPic:Express.Multer.File,legalDocuments:Express.Multer.File[])
{
const havecomany  = await this.companyRepository.FindOne({createdby:userid})
if(havecomany)
{
 throw new ConflictException("You alredy have a company")
}


const createdCompany = await this.companyRepository.CreatDocument(company)
if(!createdCompany)
{
    throw new InternalServerErrorException("Error creating")
}

const createReport = await this.companyReportsRepository.CreatDocument({CompanyId:createdCompany._id})
if(!createReport)
{
 await this.companyRepository.DeleteOne({_id:createdCompany._id})
 throw new InternalServerErrorException("Error creating")
}

const updateManger = await this.mangerRepository.UpdateOne({_id:userid},{$set:{companyId:createdCompany.id,createdAcompany:true}})
if(!updateManger)
{
    await this.companyRepository.DeleteOne({_id:createdCompany._id})
    throw new InternalServerErrorException("Error creating")
}

const baseFolder = `${FolderTypes.App}/${FolderTypes.Companies}/${createdCompany._id.toString()}`
const imagesFolder = `${baseFolder}/${FolderTypes.Photos}`
const documentsFolder = `${baseFolder}/${FolderTypes.Documents}`

const documentsPaths = legalDocuments.map((doc)=> doc.path)

const imagespaths = [logo.path,coverPic.path]

const uploadImagesResult = await this.cloudServices.uploadMany(imagespaths,imagesFolder)

if(!uploadImagesResult)
{
    await this.companyRepository.DeleteOne({_id:createdCompany._id})
    await this.mangerRepository.UpdateOne({_id:userid},{$set:{createdAcompany:false},$unset:{companyId:""}})
    throw new InternalServerErrorException("Error uploading")
}

const uploadDocumentsResult = await this.cloudServices.uploadMany(documentsPaths,documentsFolder)
if(!uploadDocumentsResult)
{   await this.cloudServices.deleteFolder(baseFolder)
    await this.companyRepository.DeleteOne({_id:createdCompany._id})
    await this.mangerRepository.UpdateOne({_id:userid},{$set:{createdAcompany:false},$unset:{companyId:""}})
    throw new InternalServerErrorException("Error uploading")
}

const updateResult = await this.companyRepository.UpdateOne({_id:createdCompany._id},{$set:{logo:uploadImagesResult[0],coverPic:uploadImagesResult[1],legalDocuments:uploadDocumentsResult}})
if(!updateResult)
{
    await this.cloudServices.deleteFolder(baseFolder)
    await this.companyRepository.DeleteOne({_id:createdCompany._id})
    await this.mangerRepository.UpdateOne({_id:userid},{$set:{createdAcompany:false},$unset:{companyId:""}})
    throw new InternalServerErrorException("Error uploading")
}
return true
}

async UpdateCompanyImage(NewImage:Express.Multer.File,companyId:Types.ObjectId,flag:CompanyImageFlag)
{  
const folder = `${FolderTypes.App}/${FolderTypes.Companies}/${companyId.toString()}/${FolderTypes.Photos}`
const company = await this.companyRepository.FindOne({_id:companyId},{coverPic:1,logo:1})

let OldImage:FileSchema|undefined = undefined

if(flag == CompanyImageFlag.coverPic)
{
OldImage = company?.coverPic
}
else 
{
OldImage = company?.logo  
}

if(!OldImage)
{
    const uploadresult = await this.cloudServices.uploadOne(NewImage.path,folder)
    if(!uploadresult)
    {
        throw new InternalServerErrorException("Error uploading")
    }

    const updateResult = await this.companyRepository.UpdateOne({_id:companyId},{$set:{[flag]:uploadresult}})

    if(!updateResult)
    {
        await this.cloudServices.DeleteFile(uploadresult.ID)
        throw new InternalServerErrorException("Error updating")
    }
} 
else 
{
    const replacmentResult = await this.cloudServices.ReplaceFile(NewImage.path,OldImage.ID,folder)
    if(!replacmentResult)
    {
        throw new InternalServerErrorException("Error uploading")
    }

    const updateResult = await this.companyRepository.UpdateOne({_id:companyId},{$set:{[flag]:replacmentResult}})

    if(!updateResult)
    {
        await this.cloudServices.DeleteFile(replacmentResult.ID)
        throw new InternalServerErrorException("Error updating")
    }
}

return true
}

async GetAllHrAccounts(companyId:Types.ObjectId)
{
console.log(companyId)
const HrList = await this.companyRepository.FindOne({_id:companyId},{Hrs:1 ,createdby:1},{populate:[{path:"Hrs",select:" userName lastName firstName profilePic.URL hireDate  phoneNumber gender permissions _id"},
 {path:"createdby",select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"}]});
if(!HrList)
{
    return []
}
else 
{
 return HrList  
}
}

async GetAllJobsUnderReview(companyId:Types.ObjectId,role:Roles,page:number,limit:number)
{

const skip = (page-1)*limit
let jobs:HydratedDocument<Job>[]|null = null

if(role == Roles.Manger)
{
jobs = await this.jobRepository.Find({companyId,status:JobStatus.UnderReview},{hrAlertNote:0},{skip:skip,limit:limit,populate:[{path:"createdBy",select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"},{path:'updatedBy',select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"}]})
}
else 
{
 jobs = await this.jobRepository.Find({companyId,status:JobStatus.UnderReview},{mangerAlert:0},{skip:skip,limit:limit,populate:[{path:"createdBy",select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"},{path:'updatedBy',select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"}]})   
}


if(!jobs)
{
    return []
}
  return jobs
}

async GetAllActiveJobs(companyId:Types.ObjectId,page:number,limit:number)
{
const skip = (page-1)*limit
console.log(skip)
const jobs = await this.jobRepository.Find({companyId,status:JobStatus.Open,deadline:{$type:"date",$gte:new Date()}},{},{skip:skip,limit:limit,populate:[{path:"createdBy",select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"},{path:'updatedBy',select:"firstName profilePic.URL hireDate lastName userName email phoneNumber gender  _id"}]})
if(!jobs)
{
    return []
}
else 
{
 return jobs
}
}

async GetAllInactiveJobs(companyId:Types.ObjectId)
{
const jobs = await this.jobRepository.Find({companyId,status:JobStatus.Closed})
if(!jobs)
{
    return []
}
else 
{
return  jobs   
}
}

async GetAllExpiredJobs(companyId: Types.ObjectId) {
  const now = new Date();

  const jobs = await this.jobRepository.Find({companyId,deadline:{$type:'date',$lt:now}},{hrAlert:0,hrAlertNote:0,__v:0});

  return jobs ?? [];
}

}
