import { Body, Controller, InternalServerErrorException, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  MangerDTO } from './dto';
import { AuthFactory } from './factory';
import { FilesInterceptor } from '@Shared/Interceptors';
import { FileTypes } from '@Shared/Helpers';
import { Filecount} from '@Shared/Enums';
import { FileData } from '@Shared/Decorators';




@Controller('auth')
export class AuthController 
{
constructor(private readonly authService:AuthService,private readonly authFactory:AuthFactory){}

@UseInterceptors(new FilesInterceptor(
[
  {Filecount:Filecount.File,Optional:true,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'coverPic'},
  {Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'profilePic'}
]
))
@Post("signup/manger")
async SignUpManger(@Body()mangerDTO:MangerDTO,@FileData({optional:true,fieldname:"coverPic"})coverimage:Express.Multer.File,@FileData({optional:false,fieldname:"profilePic"})profilePic:Express.Multer.File)
{
const manger = this.authFactory.CreateManger(mangerDTO)
const Result = await this.authService.SignUpManger(manger,coverimage,profilePic)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Successfully signed up",status:200}
}



}
