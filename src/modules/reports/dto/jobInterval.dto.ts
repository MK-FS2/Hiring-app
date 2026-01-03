import { ISPastDate } from "@Shared/Validations"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty } from "class-validator"


export class JopIntervalDTO 
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
}