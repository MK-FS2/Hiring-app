import { EmailRegex } from "@Shared/Validations"
import { IsNotEmpty, IsString, Length, Matches } from "class-validator"


export class ConfirmEmailDTO 
{
    @IsNotEmpty()
    @IsString()
    @Matches(EmailRegex,{ message: 'Email format is invalid' })
    email:string 


    @IsNotEmpty()
    @IsString()
    @Length(5,5)
    OTP:string
}