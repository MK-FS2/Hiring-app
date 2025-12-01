import { BaseUserDTO } from "./baseuser.dto";
import { IndustriesFeilds } from "@Shared/Enums";
import {  IsEnum, IsNotEmpty, IsString, Length } from "class-validator";



export class ApplicantDTO extends BaseUserDTO 
{
@IsNotEmpty()
@IsString()
@Length(2,100,{message: 'Last name must be between 2 and 100 characters' })
titel: string;

@IsNotEmpty()
@IsString()
@IsEnum(IndustriesFeilds,{each:true})
industry: IndustriesFeilds;
}