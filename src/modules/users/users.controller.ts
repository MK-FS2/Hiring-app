import { UserFactory } from './factory/index';
import { BadGatewayException, Body, Controller, Get, InternalServerErrorException, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidMongoID } from '@Shared/Pipes';
import { Types } from 'mongoose';
import { AuthGuard } from '@Shared/Guards';
import { FileData, UserData } from '@Shared/Decorators';
import { FilesInterceptor } from '@Shared/Interceptors';
import { FileTypes } from '@Shared/Helpers';
import { Filecount, Roles } from '@Shared/Enums';
import { UpdatUserDTO } from './dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController 
{
  constructor(
    private readonly usersService: UsersService,
    private readonly userFactory:UserFactory
  ) {}

@Get("publicProfile/:userId")
 async GetProfilePublic(@Param("userId",ValidMongoID)userId:Types.ObjectId)
 {
  const Data = await this.usersService.GetProfilepublic(userId)
  return Data
}

@Get("privateProfile")
async GetProfilePrivate(@UserData("_id")userId:Types.ObjectId)
{
const Data = await this.usersService.GetProfilePrivate(userId)
return Data
}

@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'coverPic'}]))
@Put("updatecoverImage/:imageId")
async UpdateCoverImage(@FileData({optional:false,fieldname:"coverPic",filecount:Filecount.File})coverimage:Express.Multer.File,@Param("imageId",ValidMongoID)imageId:Types.ObjectId,@UserData("_id")userId:Types.ObjectId)
{
const Result = await this.usersService.UpdateCoverImage(imageId,userId,coverimage)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}

@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'profilePic'}]))
@Put("updateprofileImage/:imageId")
async UpdateProfileImage(@FileData({optional:false,fieldname:"profilePic",filecount:Filecount.File})profileimage:Express.Multer.File,@Param("imageId",ValidMongoID)imageId:Types.ObjectId,@UserData("_id")userId:Types.ObjectId)
{
const Result = await this.usersService.UpdateProfileImage(imageId,userId,profileimage)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}

@Put("updateUser")
async UpdateUserData(@Body() updatUserDTO:UpdatUserDTO,@UserData("_id")userId:Types.ObjectId,@UserData("Role")userRole:Roles)
{
if(!updatUserDTO.firstName && !updatUserDTO.lastName && !updatUserDTO.password && !updatUserDTO.phoneNumber)
{
  throw new BadGatewayException("Atleast one field is required")
}


const constructedUser = this.userFactory.updateUser(updatUserDTO,userRole)
const Result = await this.usersService.UpdateUserData(constructedUser,userId,userRole)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Updated Successfully",status:200}
}

}
