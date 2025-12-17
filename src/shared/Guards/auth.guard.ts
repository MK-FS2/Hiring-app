import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ITokenPayload } from '@Shared/Interfaces';
import { Types } from 'mongoose';
import { Reflector } from "@nestjs/core";
import { TokenRepository } from '@Models/Token';
import { Public_Key } from '@Shared/constants';
import { BaseUserRepository } from '@Models/Users';




@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly baseUserRepository: BaseUserRepository,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ){}

  async canActivate(context: ExecutionContext)  
  {
    try
    {
      const publiCheck = this.reflector.getAllAndMerge(Public_Key, [context.getHandler(), context.getClass()]);

      if(publiCheck.includes(true)) 
      {
        return true;
      }

      const Access_key = this.configService.get<string>("tokens.access");
      const Refresh_key = this.configService.get<string>("tokens.refresh");

      const req = context.switchToHttp().getRequest();
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith('Bearer')) 
      {
        throw new BadRequestException('Invalid token');
      }

      const token: string = authorization.split(' ')[1];
      const payload: ITokenPayload = await this.jwtService.verifyAsync(token, { secret: Access_key });

      const userid = new Types.ObjectId(payload.id);

      const userExist = await this.baseUserRepository.FindOne({ _id: userid });
      if(!userExist)
      {
        throw new NotFoundException("No user found");
      }
      if(userExist.isBanned)
      {
        throw new UnauthorizedException("You are banned");
      }

      if (payload.exp! * 1000 < Date.now()) 
      {
        throw new BadRequestException("Expired token login again");
      }

      if (payload.iat! * 1000 < userExist.changedCredentialsAt!.getTime()) 
      {
        throw new UnauthorizedException("Deprecated token login again");
      }

      const isBlacklsited = await this.tokenRepository.checkAccessToken(token, userid);
      if(isBlacklsited)
      {
        throw new UnauthorizedException("Depricated token login again");
      }

      if (req.headers['refreshtoken']) 
      {
        const refreashtoken = req.headers['refreshtoken'] as string;
        const isRefBlacklisted = await this.tokenRepository.checkRefreshToken(refreashtoken, userid);
        if (isRefBlacklisted) 
        {
          throw new UnauthorizedException('Deprecated refresh token. Login again.');
        }

        const refreshPyload: ITokenPayload = this.jwtService.verify(refreashtoken, { secret: Refresh_key });

        if (refreshPyload.exp! * 1000 < Date.now()) 
        {
          throw new BadRequestException("Expired refresh token login again");
        }

        if (refreshPyload.iat! * 1000 < userExist.changedCredentialsAt!.getTime()) 
        {
          throw new UnauthorizedException("Deprecated refresh token login again");
        }
        console.log(refreshPyload.id)
        if(!userid.equals(new Types.ObjectId(refreshPyload.id)))
        {
          await this.baseUserRepository.UpdateOne({ _id: userid }, { $set: { isBanned: true, bannedAt: new Date(Date.now()) } });   
          throw new UnauthorizedException("Breach of protocol you are permanently banned");
        }
      }

      const clearedUser = userExist.toObject();
      delete clearedUser.password;          
      delete clearedUser.OTP;                          
      delete clearedUser.bannedAt;          
      delete clearedUser.deletedAt;       
      delete clearedUser.changedCredentialsAt;

      req.User = clearedUser;
      return true;
    }
    catch(err)
    {
      throw new BadRequestException(err.message);
    }
  }
}
