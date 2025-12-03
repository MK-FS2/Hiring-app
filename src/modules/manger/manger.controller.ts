import { Body, ConflictException, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { MangerService } from './manger.service';
import { FullGuard, UserData } from '@Shared/Decorators';
import { Roles } from '@Shared/Enums';
import { CodeDTO } from './dto';
import { Types } from 'mongoose';
import { ApprovedCompanyGuard, IsEmployeeGuard} from '@Shared/Guards';



@UseGuards(ApprovedCompanyGuard,IsEmployeeGuard)
@FullGuard(Roles.Manger)
@Controller('manger')
export class MangerController 
{
constructor(private readonly mangerService: MangerService) {}

@Post("sendSignUpcode")
async GenerateSignUpCode(@Body()codeDTO:CodeDTO,@UserData("_id")userID:Types.ObjectId,@UserData("companyId")companyId:Types.ObjectId)
{
if(!companyId)
{
  throw new ConflictException("Create a company first")
}

const Result = await this.mangerService.GenerateSignUpCode(codeDTO,userID,companyId)
if(!Result) throw new InternalServerErrorException("Internal Server Error")
return {message:"code sent succsessfully"}
}

}
