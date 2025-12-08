import { EducationSchema } from "@Models/Users";
import { Degrees } from "@Shared/Enums";
import { ISPastDate } from "@Shared/Validations";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";



export class EducationDTO implements EducationSchema
{
@IsNotEmpty()
@IsEnum(Degrees)
degree:Degrees;

@IsNotEmpty()
@IsString()
@Length(2,120)
institution: string;

@IsNotEmpty()
@ISPastDate()
@IsDate()
@Type(()=> Date)
startDate: Date;

@IsNotEmpty()
@IsDate()
@Type(()=> Date)
endDate: Date;
}