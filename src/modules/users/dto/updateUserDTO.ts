import { CarerExperienceLevels } from "@Shared/Enums";
import {PasswordRegex,PhoneRegex} from "@Shared/Validations";
import {IsEnum, IsOptional,IsString,Length,Matches} from "class-validator";


export class UpdatUserDTO 
{
@IsOptional()
@IsString()
@Length(2,20,{message:'First name must be between 2 and 20 characters'})
firstName: string;

@IsOptional()
@IsString()
@Length(2,20,{message:'First name must be between 2 and 20 characters'})
lastName: string;

@IsOptional()
@IsString()
@Matches(PhoneRegex)
phoneNumber?: string 


@IsOptional()
@IsString()
@Matches(PasswordRegex)
password?:string 

@IsOptional()
@IsString()
@IsEnum(CarerExperienceLevels)
carerLevel:CarerExperienceLevels
}