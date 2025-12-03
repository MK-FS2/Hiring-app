import { CloudServices } from '@Shared/Utils/Cloud';
import { MangerRepository } from '@Models/Users';
import { ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCompanyEntity } from './entity';
import { CompanyRepository } from '@Models/Company';
import { CompanyImageFlag, FolderTypes } from '@Shared/Enums';
import { FileSchema } from '@Models/common';


@Injectable()
export class CompanyService 
{
constructor(private readonly companyRepository:CompanyRepository,
private readonly mangerRepository:MangerRepository,
private readonly cloudServices:CloudServices
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

}
