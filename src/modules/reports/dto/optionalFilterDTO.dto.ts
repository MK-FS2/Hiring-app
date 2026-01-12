

import { IndustriesFeilds } from "@Shared/Enums"
import { ISPastDate } from "@Shared/Validations"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"



export class OptionalFilterDTO
{
 @IsNotEmpty()
 @IsOptional()
 @Type(()=>Date)
 @ISPastDate({message:"only past dates are allowed"})
 @IsDate()
 from:Date
    
 @Type(()=>Date)
 @IsDate()
 @IsOptional()
 @IsNotEmpty()
 to:Date

 @IsNotEmpty()
 @IsOptional()
 @IsString()
 @IsEnum(IndustriesFeilds)
 industry:IndustriesFeilds|undefined
}