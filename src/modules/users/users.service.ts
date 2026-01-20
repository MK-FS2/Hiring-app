import { SavedPostsRepository } from '@Models/SavedJobPosts';
import { ApplicantRepository, BaseUserRepository } from '@Models/Users';
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { FolderTypes, Roles } from '@Shared/Enums';
import { CloudServices } from '@Shared/Utils/Cloud';
import { Types } from 'mongoose';
import { UpdateUserEntity } from './entity';

@Injectable()
export class UsersService 
{
constructor(
private readonly baseUserRepository:BaseUserRepository,
private readonly cloudServices:CloudServices,
private readonly applicantRepository:ApplicantRepository,
private readonly savedPostsRepository:SavedPostsRepository
){}


async GetProfilepublic(userId:Types.ObjectId)
{
 const userData = await this.baseUserRepository.FindOne({_id:userId},{"CVS._id":0,bannedAt:0,"CVS.cvFile.ID":0,"CVS.cvFile._id":0,"coverPic._id":0,"profilePic._id":0,hireDate:0,__v:0,provider:0,updatedAt:0,isVerified:0,isBanned:0,permissions:0,"coverPic.ID":0,password:0,OTP:0,changedCredentialsAt:0,"profilePic.ID":0,createdAcompany:0})
 if(!userData)
 {
    throw new NotFoundException("No User Found")
 }
 return userData 
}

async GetProfilePrivate(userId:Types.ObjectId)
{
const userData = await this.baseUserRepository.FindOne({_id:userId},{OTP:0,password:0,bannedAt:0,updatedAt:0,__v:0,isVerified:0,provider:0,changedCredentialsAt:0,"profilePic.ID":0,"coverPic.ID":0})
return userData
}

async UpdateCoverImage(imageObjectId:Types.ObjectId,userId:Types.ObjectId,newImage:Express.Multer.File)
{
const user = await this.baseUserRepository.FindOne({_id:userId,"coverPic._id":imageObjectId},{coverPic:1})
if(!user || ! user.coverPic)
{
throw new ConflictException("Image Dont Exist")
}
 const folder = `${FolderTypes.App}/${FolderTypes.Users}/${userId.toString()}/${FolderTypes.Photos}`

const replacmentResult = await this.cloudServices.ReplaceFile(newImage.path,user.coverPic.ID,folder)
if(!replacmentResult)
{
    throw new InternalServerErrorException("Upload failed")
}
const updateResult = await this.baseUserRepository.UpdateOne({_id:userId},{$set:{coverPic:replacmentResult,changedCredentialsAt:new Date(Date.now())}})
if(!updateResult)
{
    await this.cloudServices.DeleteFile(replacmentResult.ID)
    throw new InternalServerErrorException("Update failed reupload")
}
return true
}

async UpdateProfileImage(imageObjectId:Types.ObjectId,userId:Types.ObjectId,newImage:Express.Multer.File)
{
const user = await this.baseUserRepository.FindOne({_id:userId,"profilePic._id":imageObjectId},{profilePic:1})
if(!user || ! user.profilePic)
{
throw new ConflictException("Image Dont Exist")
}
 const folder = `${FolderTypes.App}/${FolderTypes.Users}/${userId.toString()}/${FolderTypes.Photos}`

const replacmentResult = await this.cloudServices.ReplaceFile(newImage.path,user.profilePic.ID,folder)
if(!replacmentResult)
{
    throw new InternalServerErrorException("Upload failed")
}
const updateResult = await this.baseUserRepository.UpdateOne({_id:userId},{$set:{profilePic:replacmentResult,changedCredentialsAt:new Date(Date.now())}})
if(!updateResult)
{
    await this.cloudServices.DeleteFile(replacmentResult.ID)
    throw new InternalServerErrorException("Update failed reupload")
}
return true
}

async UpdateUserData(constructedUser:UpdateUserEntity,userId:Types.ObjectId,userRole:Roles)
{

    let result:boolean

    if(userRole == Roles.Applicant)
    {
      result = await this.applicantRepository.UpdateOne({_id:userId},{$set:constructedUser,changedCredentialsAt:new Date(Date.now())})
    }
    else 
    {
     result = await this.baseUserRepository.UpdateOne({_id:userId},{$set:constructedUser,changedCredentialsAt:new Date(Date.now())})
    }

    if(!result)
    {
        throw new InternalServerErrorException("Error Updating")
    }
    return true
}

async DeleteApplicantAccount(userId:Types.ObjectId,role:Roles)
{
if(role != Roles.Applicant)throw new UnauthorizedException('Only Applicants can delet there Account')
const userExist = await this.baseUserRepository.Exist({_id:userId})
if(!userExist)throw new NotFoundException("NoUserFound")


 const [r1,r2] =await Promise.all(
 [
 this.baseUserRepository.DeleteOne({_id:userId}),
 this.savedPostsRepository.DeleteMany({userId:userId})
 ])

if(!r1)throw new InternalServerErrorException("Error Deleting")
if(!r2)throw new InternalServerErrorException("Error Deleting")


 const folder = `${FolderTypes.App}/${FolderTypes.Users}/${userId.toString()}`
 await this.cloudServices.deleteFolder(folder)
 
return true
}

}
