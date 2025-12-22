import { Injectable } from '@nestjs/common';
import { UpdateUserEntity } from '../entity';
import { UpdatUserDTO } from './../dto/updateUserDTO';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js";


@Injectable()
export class UserFactory
{
private readonly key: string;

constructor(private readonly configService: ConfigService)
{
  const key = this.configService.get<string>('encryption.key');
  if (!key) 
  {
    throw new Error('Missing encryption.key in configuration');
  }
  this.key = key;
}

updateUser(updatUserDTO:UpdatUserDTO)
{
const user = new UpdateUserEntity ()

if(updatUserDTO.firstName)
{
    user.firstName = updatUserDTO.firstName
}
if(updatUserDTO.lastName)
{
    user.lastName = updatUserDTO.lastName
}
if(updatUserDTO.phoneNumber)
{
user.phoneNumber = CryptoJS.AES.encrypt(updatUserDTO.phoneNumber,this.key).toString()
}

if(updatUserDTO.password)
{
    user.password =  bcrypt.hashSync(updatUserDTO.password,10)
}

return user
}

}