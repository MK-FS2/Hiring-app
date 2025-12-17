import { ISFutureDate, ISMilitaryTime } from "@Shared/Validations";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString} from "class-validator";



export class InterviewDTO 
{
    @IsNotEmpty()
    @IsDate()
    @Type(()=> Date)
    @ISFutureDate()
    interviewDate:Date 

    @IsNotEmpty()
    @ISMilitaryTime()
    @IsString()
    interviewTime:string
}