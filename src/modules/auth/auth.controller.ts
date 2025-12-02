import { LoginDTO } from './dto/login.dto';
import { nanoid } from 'nanoid';
import { BadRequestException, Body, Controller, InternalServerErrorException, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  ApplicantDTO, ConfirmEmailDTO, MangerDTO, ResetPasswordDTO } from './dto';
import { AuthFactory } from './factory';
import { FilesInterceptor } from '@Shared/Interceptors';
import { FileTypes } from '@Shared/Helpers';
import { Filecount, OTPTypes} from '@Shared/Enums';
import { FileData } from '@Shared/Decorators';
import { IsValidEmailPipe } from '@Shared/Pipes';




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
async SignUpManger(@Body()mangerDTO:MangerDTO,@FileData({optional:true,fieldname:"coverPic",filecount:Filecount.File})coverimage:Express.Multer.File,@FileData({optional:false,fieldname:"profilePic",filecount:Filecount.File})profilePic:Express.Multer.File)
{
const otpcode = nanoid(5)
const manger = this.authFactory.CreateManger(mangerDTO,otpcode)
const Result = await this.authService.SignUpManger(manger,coverimage,profilePic,otpcode)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Successfully signed up",status:200}
}

// @Post("signup/hr")
// async SignUpHr(@Body()hrDTO:HRDTO,@FileData({optional:true,fieldname:"coverPic"})coverimage:Express.Multer.File,@FileData({optional:false,fieldname:"profilePic"})profilePic:Express.Multer.File)
// {
//   const hr =  this.authFactory.CreateHR(hrDTO)
//   const Result = await this.authService.SignUpHR(hr,coverimage,profilePic)
//   if(!Result) throw new InternalServerErrorException("Internal Server Error")
//   return {message:"Successfully signed up",status:200}

// }


@Post("signup/applicant")
@UseInterceptors(new FilesInterceptor(
[
  {Filecount:Filecount.File,Optional:true,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'coverPic'},
  {Filecount:Filecount.File,Optional:false,Size:1*1024*1024,FileType:FileTypes.Image,FieldName:'profilePic'}
]
))
async SignUpApplicantSystem(@Body()applicantDTO:ApplicantDTO,@FileData({optional:true,fieldname:"coverPic",filecount:Filecount.File})coverimage:Express.Multer.File,@FileData({optional:false,fieldname:"profilePic",filecount:Filecount.File})profilePic:Express.Multer.File)
{
  const otpcode = nanoid(5)
  const applicant = this.authFactory.CreateApplicant(applicantDTO,otpcode)
  const Result = await this.authService.SignUpApplicantSystem(applicant,coverimage,profilePic,otpcode)
  if(!Result) throw new InternalServerErrorException("Internal Server Error")
  return {message:"Successfully signed up",status:200}
}

@Post("signup/applicant/Google")
async SignUpApplicantGoogle(@Body()OAuthToken:string)
{
const Result = await this.authService.SignUpApplicantGoogle(OAuthToken)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Successfully signed up",status:200}
}

@Post("confirmEmail")
async ConfirmEmail(@Body()confirmEmailDTO:ConfirmEmailDTO)
{
const Result = await this.authService.ConfirmEmail(confirmEmailDTO)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return
}

@Post("resendOTP/:flag")
async ResendOTP(@Body("email",IsValidEmailPipe) email: string,@Param('flag',ParseIntPipe) flag: number) 
{

  if (flag != 0 && flag != 1) 
  {
    throw new BadRequestException("Invalid param");
  }
  let mapedflag:OTPTypes =OTPTypes.ConfirmEmail

  if(flag == 0)
  {
    mapedflag = OTPTypes.ConfirmEmail
  }
  else 
  {
     mapedflag = OTPTypes.ForgetPassword
  }
  console.log(mapedflag)
  const otpcode = nanoid(5);
  const Result = await this.authService.ResendOTP(email,mapedflag, otpcode);

  if (!Result) throw new InternalServerErrorException("Internal Server Error");

  return { success: true };
}

@Put("resetPassword")
async ResetPassword(@Body()resetPasswordDTO:ResetPasswordDTO)
{
const Result = await this.authService.ResetPassword(resetPasswordDTO)
if (!Result) throw new InternalServerErrorException("Internal Server Error");
return { success: true };
}


@Post("login/system")
async LoginSsytem(@Body()loginDTO:LoginDTO)
{
const Token = await this.authService.LoginSystem(loginDTO)
return Token
}


}
