import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseUserRepository } from './../../models/Users/BaseUser/BaseUser.Repository';
import { TokenRepository } from './../../models/Token/Token.Repository';
import { BadRequestException, CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ITokenPayload } from '@Shared/Interfaces';
import { Types } from 'mongoose';




export class AuthGuard implements CanActivate
{
constructor(private readonly tokenRepository:TokenRepository,private readonly jwtService:JwtService,private readonly baseUserRepository:BaseUserRepository,private readonly configService:ConfigService){}
 async canActivate(context:ExecutionContext)  
 {
  const Access_key = this.configService.get<string>("tokens.access")
  const Refresh_key = this.configService.get<string>("tokens.refresh")


  const req = context.switchToHttp().getRequest()
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) 
  {
    throw new BadRequestException('Invalid token');
  }
  const token:string = authorization.split(' ')[1];
  const payload:ITokenPayload = await this.jwtService.verifyAsync(token,{secret:Access_key})

  const userid = new Types.ObjectId(payload.id) 
 
  const userExist = await this.baseUserRepository.FindOne({_id:userid})
  if(!userExist)
  {
    throw new NotFoundException("No user found")
  }
  if(userExist.isBanned)
  {
    throw new UnauthorizedException("You are banned")
  }

 if (payload.exp! * 1000 < Date.now()) 
  {
  throw new BadRequestException("Expired token login again");
  }
 
 if (payload.iat! * 1000 < userExist.changedCredentialsAt!.getTime()) 
 {
  throw new UnauthorizedException("Deprecated token login again");
 }

const isBlacklsited = await this.tokenRepository.checkAccessToken(token,userid)
if(isBlacklsited)
{
    throw new UnauthorizedException("Depricated token login again")
}

 if (req.headers['refreshtoken']) 
 {
 const refreashtoken = req.headers['refreashtoken'] as string;
 const isRefBlacklisted = await this.tokenRepository.checkRefreshToken(refreashtoken,userid);
 if (isRefBlacklisted) 
 {
 throw new UnauthorizedException('Deprecated refresh token. Login again.');
 }

 const refreshPyload:ITokenPayload = this.jwtService.verify(refreashtoken,{secret:Refresh_key});

if (refreshPyload.exp! * 1000 < Date.now()) 
{
  throw new BadRequestException("Expired refresh token login again");
} 

if (refreshPyload.iat! * 1000 < userExist.changedCredentialsAt!.getTime()) 
{
  throw new UnauthorizedException("Deprecated refresh token login again");
}

if(!userid.equals(refreshPyload.id))
{
 await this.baseUserRepository.UpdateOne({_id:userid},{$set:{isBanned:true,bannedAt:new Date(Date.now())}})   
 throw new UnauthorizedException("Breach of protocol: you are permanently banned");
}
}
return true
}
}