import { CompanyFactory } from './factory/index';
import { Types } from 'mongoose';
import { Body, Controller, InternalServerErrorException, Post, Put, UseInterceptors} from '@nestjs/common';
import { CompanyService } from './company.service';
import { FileData, FullGuard, UserData } from '@Shared/Decorators';
import { CompanyImageFlag, Filecount, Roles } from '@Shared/Enums';
import { CreateCompanyDTO } from './dto';
import { FileTypes } from '@Shared/Helpers';
import { FilesInterceptor } from '@Shared/Interceptors';


  // to do add decrate is company owner

@FullGuard(Roles.Manger) 
@Controller('company')
export class CompanyController 
{
  constructor(private readonly companyService: CompanyService,
  private readonly companyFactory:CompanyFactory
  ){}

 @UseInterceptors(new FilesInterceptor(
 [
   {Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'coverPic'},
   {Filecount:Filecount.Files,Optional:false,Size:30*1024*1024,FileType:FileTypes.Document,FieldName:'legalDocuments',MaxImagecount:3},
   {Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'logo'}
 ]
 ))
 @Post("createCompany")
 async CreateCompany(@Body()createCompanyDTO:CreateCompanyDTO,@UserData("_id")userid:Types.ObjectId,@FileData({optional:false,fieldname:"coverPic",filecount:Filecount.File})coverPic:Express.Multer.File,@FileData({optional:true,fieldname:"logo",filecount:Filecount.File})logo:Express.Multer.File,@FileData({optional:true,fieldname:"legalDocuments",filecount:Filecount.Files})legalDocuments:Express.Multer.File[])
 {
  const company = this.companyFactory.CreateCompany(createCompanyDTO,userid)
  const Result = await this.companyService.CreateCompany(company,userid,logo,coverPic,legalDocuments)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:" Company created Successfully",status:200}
 }


@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'coverPic'}]))
@Put("updateCoverImage")
async UpdateCoverImage(@FileData({optional:false,filecount:Filecount.File,fieldname:"coverPic"})coverPic:Express.Multer.File,@UserData("companyId")companyId:Types.ObjectId)
{
const Result = await this.companyService.UpdateCompanyImage(coverPic,companyId,CompanyImageFlag.coverPic)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:" Updated image Successfully",status:200}
}


@UseInterceptors(new FilesInterceptor([{Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'logo'}]))
@Put("updateLogo")
async UpdateLogo(@FileData({optional:false,filecount:Filecount.File,fieldname:"logo"})coverPic:Express.Multer.File,@UserData("companyId")companyId:Types.ObjectId)
{
const Result = await this.companyService.UpdateCompanyImage(coverPic,companyId,CompanyImageFlag.logo)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:" Updated image Successfully",status:200}
}



}
