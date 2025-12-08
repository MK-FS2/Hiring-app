import { EducationSchema } from "@Models/Users";
import { Degrees } from "@Shared/Enums";
import { ISPastDate } from "@Shared/Validations";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";



export class UpdateEducationDTO implements EducationSchema
{
@IsNotEmpty()
@IsOptional()
@IsEnum(Degrees)
degree:Degrees;

@IsNotEmpty()
@IsString()
@Length(2,120)
@IsOptional()
institution: string;

@IsNotEmpty()
@ISPastDate()
@IsDate()
@IsOptional()
@Type(()=> Date)
startDate: Date;

@IsNotEmpty()
@IsDate()
@IsOptional()
@Type(()=> Date)
endDate: Date;
}