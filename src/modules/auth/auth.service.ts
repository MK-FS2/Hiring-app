import { BaseUserRepository } from './../../models/Users/BaseUser/BaseUser.Repository';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MangerEntity } from './entity/manger.entity';
import { MangerRepository } from '@Models/Users';
import { MailService } from '@Shared/Utils';

@Injectable()
export class AuthService 
{
constructor(private readonly baseUserRepository:BaseUserRepository,
private readonly mangerRepository:MangerRepository,private readonly mailService:MailService
){}

async SignUpManger(manger:MangerEntity)
{
    const emailExist = await this.baseUserRepository.Exist({email:manger.email})
    if(emailExist)
    {
        throw new ConflictException("Email already exist")
    }
    const phoneExist = await this.baseUserRepository.Exist({phoneNumber:manger.phoneNumber})
    if(phoneExist)
    {
        throw new ConflictException("Phone number already exist")
    }

    const result = await this.mangerRepository.CreatDocument(manger)

    const emailResult = await this.mailService.sendMail(manger.email,manger.OTP[0].OTP,new Date(Date.now()+10*60*1000))
    if(!emailResult)
    {
    throw new InternalServerErrorException("Email not sent")
    }
    return result
}


}
