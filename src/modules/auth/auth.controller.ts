import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MangerDTO } from './dto';
import { AuthFactory } from './factory';

@Controller('auth')
export class AuthController 
{
  constructor(private readonly authService:AuthService,private readonly authFactory:AuthFactory){}

@Post("signup/manger")
async SignUpManger(@Body()mangerDTO:MangerDTO)
{
const manger = this.authFactory.CreateManger(mangerDTO)
const Result = await this.authService.SignUpManger(manger)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"Successfully signed up",status:200}
}

}
