import { Genders, UserAgent } from "@Shared/Enums";



export class BaseUserEntity
{
firstName: string;
lastName: string;
password: string;
phoneNumber: string;
email: string;
gender: Genders;
dateofbirth: Date;
provider:UserAgent
}