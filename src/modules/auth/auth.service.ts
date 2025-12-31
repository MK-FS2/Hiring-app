import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Applicant, ApplicantRepository } from '@Models/Users';
import { HRRepository } from '@Models/Users';
import { ConflictException, Injectable, InternalServerErrorException,UnauthorizedException, BadRequestException} from '@nestjs/common';
import { BaseUserRepository, MangerRepository } from '@Models/Users';
import { MailService } from '@Shared/Utils';
import { CloudServices } from '@Shared/Utils/Cloud';
import { FolderTypes, OTPTypes, UserAgent } from '@Shared/Enums';
import { ApplicantEntity, HREntity, MangerEntity } from './entity';
import * as bcrypt from 'bcrypt';
import { ConfirmEmailDTO, ResetPasswordDTO } from './dto';
import { OAuth2Client } from "google-auth-library";
import { LoginDTO } from './dto/login.dto';
import { Types } from 'mongoose';
import { CompanyRepository } from '@Models/Company';
import { TokenRepository } from '@Models/Token';
import { EmployeeRecordRepository } from '@Models/Statistics/EmployeeStatistics/EmployeeRecord';





@Injectable()
export class AuthService 
{
constructor(
private readonly baseUserRepository:BaseUserRepository,
private readonly mangerRepository:MangerRepository,private readonly mailService:MailService,
private readonly cloudServices:CloudServices,
private readonly hrRepository:HRRepository,
private readonly applicantRepository:ApplicantRepository,
private readonly configService:ConfigService,
private readonly jwtService:JwtService,
private readonly companyRepository:CompanyRepository,
private readonly tokenRepository:TokenRepository,
private readonly employeeRecordRepository:EmployeeRecordRepository
){}

 
async SignUpManger(manger:MangerEntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File,otpcode:string)
{
  const [emailExist,phoneExist] = await Promise.all(
  [
    this.baseUserRepository.Exist({email:manger.email}),
    this.baseUserRepository.Exist({phoneNumber:manger.phoneNumber})
  ])

  if(emailExist)throw new ConflictException("Email already exist")
  if(phoneExist)throw new ConflictException("Phone number already exist")

  const creationResult = await this.mangerRepository.CreatDocument(manger)
  if(!creationResult)throw new InternalServerErrorException("Error creating")

  const folder = `${FolderTypes.App}/${FolderTypes.Users}/${creationResult._id.toString()}/${FolderTypes.Photos}`

  const rolleback = async()=>
  {
    await Promise.allSettled(
    [
      this.mangerRepository.DeleteOne({_id:creationResult._id}),
      this.cloudServices.deleteFolder(folder)
    ])
  }

  try
  {
    const uploads = [this.cloudServices.uploadOne(profilePic.path,folder)]
    if(coverimage)uploads.push(this.cloudServices.uploadOne(coverimage.path,folder))

    const [profile,cover] = await Promise.all(uploads)

    if(!profile)throw new InternalServerErrorException("Error uploading profile image")
    if(coverimage && !cover)throw new InternalServerErrorException("Error uploading cover image")

    const updateData = coverimage
    ? {coverPic:cover,profilePic:profile}
    : {profilePic:profile}

    const [update,emailResult] = await Promise.all(
    [
      this.mangerRepository.UpdateOne({_id:creationResult._id},{$set:updateData}),
      this.mailService.sendMail(manger.email,otpcode,new Date(Date.now()+10*60*1000))
    ])

    if(!update)throw new InternalServerErrorException("Error creating")
    if(!emailResult)throw new InternalServerErrorException("Email not sent")
  }
  catch(err)
  {
    await rolleback()
    throw new InternalServerErrorException(err)
  }

  return creationResult
}

async SignUpHR(hr:HREntity,otpcode:string,coverimage:Express.Multer.File,profilePic:Express.Multer.File)
{
  const [emailExist,phoneExist,CompanyExist] =  await Promise.all(
  [
   this.baseUserRepository.Exist({email:hr.email}),
   this.baseUserRepository.Exist({phoneNumber:hr.phoneNumber}),
   this.companyRepository.FindOne({"companycodes.code":hr.code},{_id:1,companyname:1,"companycodes.$":1})
  ])
  
  if(emailExist)throw new ConflictException("Email already exist")
  if(phoneExist)throw new ConflictException("Phone number already exist")
  if(!CompanyExist)throw new BadRequestException("Invalid code")

  if(CompanyExist.companycodes && CompanyExist.companycodes[0].expireAt < new Date(Date.now()))throw new UnauthorizedException("expired code")
  if(hr.email != CompanyExist.companycodes![0].directedTo)throw new UnauthorizedException("You are not authourized")
   
   const creationResult = await this.hrRepository.CreatDocument(hr)
   if(!creationResult)throw new InternalServerErrorException("Error creating")
   
   const folder = `${FolderTypes.App}/${FolderTypes.Users}/${creationResult._id.toString()}/${FolderTypes.Photos}`

   const rolleback = async()=>
   {
    await Promise.allSettled(
    [
       this.hrRepository.DeleteOne({_id:creationResult._id}),
       this.companyRepository.UpdateOne({_id:CompanyExist._id},{$pull:{Hrs:creationResult._id}}),
       this.cloudServices.deleteFolder(folder)
    ])
   }

   try 
   {
    const uploads = [this.cloudServices.uploadOne(profilePic.path,folder)]
    if(coverimage) uploads.push(this.cloudServices.uploadOne(coverimage.path,folder))

    const [profile, cover] = await Promise.all(uploads)
    if(!profile)throw new InternalServerErrorException("Error uploading profile image")
    if(coverimage && !cover)throw new InternalServerErrorException(`Error uploading cover image`) 

    const updateData = coverimage ? {coverPic:cover,profilePic:profile} : {profilePic:profile}

    const [update,addToCompany,recordResult,emailResult] = await Promise.all(
    [
     this.hrRepository.UpdateOne({_id:creationResult._id},{$set:updateData}),
     this.companyRepository.UpdateOne({_id: CompanyExist._id}, {$addToSet: {Hrs:creationResult._id}, $pull: {companycodes: {directedTo: hr.email}}}),
     this.employeeRecordRepository.CreateEmployeeRecord(CompanyExist._id,creationResult._id),
     this.mailService.sendMail(hr.email,otpcode,new Date(Date.now()+10*60*1000))
    ])

    if(!update)throw new InternalServerErrorException("Error creating")
    if(!addToCompany)throw new InternalServerErrorException("Error Joining Company")
    if(!recordResult)throw new InternalServerErrorException("Failed To Create Record")
    if(!emailResult)throw new InternalServerErrorException(" Failed To send OTP")
   }
   catch(err)
   {
    await rolleback()
    throw new InternalServerErrorException(err)
   }
   return true
}

async ConfirmEmail(confirmEmailDTO: ConfirmEmailDTO) 
{
  const userExist = await this.baseUserRepository.FindOne({ email: confirmEmailDTO.email },{ email:1, OTP: 1});

  if (!userExist) 
  {
    throw new BadRequestException("Invalid email");
  }

  if (!userExist.OTP || userExist.OTP.length === 0) 
  {
    throw new BadRequestException("No OTP found");
  }

 

  let otpMatch = false;
  let otpExpiresAt: Date = new Date();

  for (const obj of userExist.OTP) 
    {
    if (bcrypt.compareSync(confirmEmailDTO.OTP, obj.OTP) && obj.OTPtype == OTPTypes.ConfirmEmail) 
    {
      otpMatch = true;
      otpExpiresAt = new Date(obj.ExpiresAt);
      break;
    }
  }

  if (!otpMatch) 
  {
    throw new BadRequestException("Invalid OTP");
  }

  if (new Date() > otpExpiresAt) 
  {
    throw new BadRequestException("OTP timed out");
  }
 await this.baseUserRepository.UpdateOne({email:confirmEmailDTO.email},{$pull:{OTP:{OTPtype: OTPTypes.ConfirmEmail}}});
 const result = await this.baseUserRepository.UpdateOne({email:confirmEmailDTO.email},{$set:{isVerified:true}});
 if(!result)
 {
  throw new InternalServerErrorException("Error info")
 }

  return true;
}

async ResendOTP(email: string, flag: OTPTypes, otpcode: string) 
{
  console.log(email)
  const userExist = await this.baseUserRepository.FindOne({ email });
  if (!userExist) {
    throw new BadRequestException("Invalid email");
  }

  const OTP = 
  {
    OTP: bcrypt.hashSync(otpcode, 10),
    OTPtype: flag,
    ExpiresAt: new Date(Date.now() + 10 * 60 * 1000), 
  };

  const emailResult = await this.mailService.sendMail(email, otpcode, OTP.ExpiresAt);
  if (!emailResult) throw new InternalServerErrorException("Error sending OTP");

  await this.baseUserRepository.UpdateOne({ email},{$pull:{OTP:{OTPtype:flag}}}) 
  const  updateResult = await this.baseUserRepository.UpdateOne({email},{$push:{OTP}});

  if (!updateResult) throw new InternalServerErrorException("Error updating OTP");

  return true;
}

async ResetPassword(resetPasswordDTO:ResetPasswordDTO)
{
const userExist = await this.baseUserRepository.FindOne({email:resetPasswordDTO.email},{OTP:1})
if(!userExist)
{
  throw new BadRequestException("Invalied email")
}
let otpMatch:boolean = false;
let otpExpiresAt: Date = new Date();



if (!userExist.OTP || userExist.OTP.length === 0) 
{
throw new BadRequestException("No OTP found");
}

for (const obj of userExist.OTP) 
{
  if (bcrypt.compareSync(resetPasswordDTO.OTP, obj.OTP) && obj.OTPtype == OTPTypes.ForgetPassword) 
  {
      otpMatch = true;
      otpExpiresAt = new Date(obj.ExpiresAt);
      break;
  }
  }

  if (!otpMatch) 
  {
    throw new BadRequestException("Invalid OTP");
  }

  if (new Date() > otpExpiresAt) 
  {
    throw new BadRequestException("OTP timed out");
  }

  const updatingResult = await this.baseUserRepository.UpdateOne({email:resetPasswordDTO.email},{$set:{changedCredentialsAt:new Date(Date.now()),password:resetPasswordDTO.password}})
  if(!updatingResult)
  {
    throw new InternalServerErrorException()
  }
  await this.baseUserRepository.UpdateOne({email:resetPasswordDTO.email},{$pull:{OTP:{OTPtype:OTPTypes.ForgetPassword}}})
return true

}

async SignUpApplicantSystem(applicant:ApplicantEntity,coverimage:Express.Multer.File,profilePic:Express.Multer.File,otpcode:string)
{
  const [emailExist,phoneExist] = await Promise.all(
  [
    this.baseUserRepository.Exist({email:applicant.email}),
    this.baseUserRepository.Exist({phoneNumber:applicant.phoneNumber})
  ])

  if(emailExist)throw new ConflictException("Email already exist")
  if(phoneExist)throw new ConflictException("Phone number already exist")

  const creationResult = await this.applicantRepository.CreatDocument(applicant)
  if(!creationResult)throw new InternalServerErrorException("Error creating")

  const folder = `${FolderTypes.App}/${FolderTypes.Users}/${creationResult._id.toString()}/${FolderTypes.Photos}`

  const rolleback = async()=>
  {
    await Promise.allSettled(
    [
      this.applicantRepository.DeleteOne({_id:creationResult._id}),
      this.cloudServices.deleteFolder(folder)
    ])
  }

  try
  {
    const uploads = [this.cloudServices.uploadOne(profilePic.path,folder)]
    if(coverimage)uploads.push(this.cloudServices.uploadOne(coverimage.path,folder))

    const [profile,cover] = await Promise.all(uploads)

    if(!profile)throw new InternalServerErrorException("Error uploading profile image")
    if(coverimage && !cover)throw new InternalServerErrorException("Error uploading cover image")

    const updateData = coverimage? {coverPic:cover,profilePic:profile}:{profilePic:profile}

    const [update,emailResult] = await Promise.all(
    [
      this.applicantRepository.UpdateOne({_id:creationResult._id},{$set:updateData}),
      this.mailService.sendMail(applicant.email,otpcode,new Date(Date.now()+10*60*1000))
    ])

    if(!update)throw new InternalServerErrorException("Error creating")
    if(!emailResult)throw new InternalServerErrorException("Email not sent")
  }
  catch(err)
  {
    await rolleback()
    throw new InternalServerErrorException(err)
  }

  return true
}

async SignUpApplicantGoogle(OAuthToken:string) {
  const key = this.configService.get<string>('google.clientId');
  if (!key) throw new InternalServerErrorException('Google Client ID is not configured');

  const client = new OAuth2Client(key);

  const ticket = await client.verifyIdToken({
    idToken: OAuthToken,
    audience: key,
  });

  const googlePayload = ticket.getPayload();
  if (!googlePayload || !googlePayload.email || !googlePayload.given_name || !googlePayload.family_name) {
    throw new BadRequestException(
      'Google account did not provide required permissions (email, first name, last name).',
    );
  }

 const applicant:Applicant = 
 {
  firstName: googlePayload.given_name,
  lastName: googlePayload.family_name,
  email: googlePayload.email,
  isVerified: true,
  provider: UserAgent.Google,
  profilePic: {ID:'Code_Google',URL:googlePayload.picture || ''},
};


const creationResult = await this.applicantRepository.CreatDocument(applicant)
if(!creationResult)
{
  throw new InternalServerErrorException("Error creating")
}
return true
}

async LoginSystem(loginDTO:LoginDTO)
{
const userExist = await this.baseUserRepository.FindOne({email:loginDTO.email,isVerified:true})
if(!userExist)
{
  throw new BadRequestException("Invalid email or password")
}

if(userExist.isBanned)
{
    throw new UnauthorizedException("Your are banned")
}


if(userExist.provider == UserAgent.Google)
{
  throw new UnauthorizedException("login using google")
}


if(!bcrypt.compareSync(loginDTO.password,userExist.password!))
{
throw new BadRequestException("Invalid email or password")
}


   const payload = 
  {
    id: userExist._id,
    fullName: `${userExist.firstName}-${userExist.lastName}`,
    email: userExist.email,
    role: userExist.Role,
  };

  const Akey = this.configService.get<string>("tokens.access")
  const Rkey = this.configService.get<string>("tokens.refresh")

  const accessToken = this.jwtService.sign(payload, {secret:Akey,expiresIn:'7d'});
  const refreshToken = this.jwtService.sign(payload,{secret:Rkey,expiresIn:'30d'});
  
  return {accessToken,refreshToken}

}


async Logout(accessToken:string,refreshToken:string,userId:Types.ObjectId)
{
const blacklistingResult = await this.tokenRepository.blackListTokens(accessToken,refreshToken,userId)
if(!blacklistingResult)
{
  throw new InternalServerErrorException()
}
return true
}


async RefreshTokens(oldaccessToken:string,oldrefreshToken:string,userId:Types.ObjectId)
{
  const userExist = await this.baseUserRepository.FindOne({_id:userId},{firstName:1,lastName:1,email:1,Role:1})
  if(!userExist)
  {
   throw new BadRequestException("Invalid email or password")
  } 
   const payload = 
  {
    id: userExist._id,
    fullName: `${userExist.firstName}-${userExist.lastName}`,
    email: userExist.email,
    role: userExist.Role,
  };

  const Akey = this.configService.get<string>("tokens.access")
  const Rkey = this.configService.get<string>("tokens.refresh")
  const accessToken = this.jwtService.sign(payload, {secret:Akey,expiresIn:'7d'});
  const refreshToken = this.jwtService.sign(payload,{secret:Rkey,expiresIn:'30d'});

  const result = await this.tokenRepository.blackListTokens(oldaccessToken,oldrefreshToken,userId)
   if(!result)
   {
    throw new InternalServerErrorException()
   }
  return {accessToken,refreshToken}
}

}
