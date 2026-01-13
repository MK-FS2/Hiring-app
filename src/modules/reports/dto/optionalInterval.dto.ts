import { ISPastDate } from "@Shared/Validations"
import { IsDateString, IsOptional } from "class-validator"


export class OptionalInterval 
{

    @IsOptional()
    @IsDateString()
    @ISPastDate({message:"only past dates are allowed"})
    from:Date

    @IsOptional()
    @IsDateString()
    to:Date
}