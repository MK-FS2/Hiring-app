import { BaseUserRepository } from './../../models/Users/BaseUser/BaseUser.Repository';
import { Injectable } from '@nestjs/common';
import { MangerEntity } from './entity/manger.entity';

@Injectable()
export class AuthService 
{
constructor(private readonly baseUserRepository:BaseUserRepository){}

async SignUpManger(manger:MangerEntity)
{

    const result = await this.baseUserRepository.CreatDocument(manger)
    return result


}


}
