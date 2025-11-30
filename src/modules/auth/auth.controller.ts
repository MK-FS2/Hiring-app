import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MangerDTO } from './dto';
import { AuthFactory } from './factory';

@Controller('auth')
export class AuthController 
{
  constructor(private readonly authService:AuthService,private readonly authFactory:AuthFactory){}

@Post()
async SignUpManger(@Body()mangerDTO:MangerDTO)
{
const manger = this.authFactory.CreateManger(mangerDTO)
const Result = await this.authService.SignUpManger(manger)
return Result
}

}
