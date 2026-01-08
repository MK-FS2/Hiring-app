import { IndustriesFeilds } from "@Shared/Enums"
import { ISPastDate } from "@Shared/Validations"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator"



export class JobPerIndustry 
{
 @IsNotEmpty()
 @Type(()=>Date)
 @ISPastDate({message:"only past dates are allowed"})
 @IsDate()
 from:Date 
    
 @Type(()=>Date)
 @IsDate()
 @IsNotEmpty()
 to:Date

 @IsNotEmpty()
 @IsString()
 @IsEnum(IndustriesFeilds)
 industry:IndustriesFeilds
}