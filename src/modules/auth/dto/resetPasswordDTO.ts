import { EmailRegex, IsPasswordMatch, PasswordRegex } from "@Shared/Validations"
import { IsNotEmpty, IsString, Length, Matches } from "class-validator"


export class ResetPasswordDTO 
{
    @IsNotEmpty()
    @IsString()
    @Matches(EmailRegex)
    email:string

    @IsNotEmpty()
    @IsString()
    @Matches(PasswordRegex)
    password:string

    @IsNotEmpty()
    @IsString()
    @IsPasswordMatch({message:"RePassword dont match"})
    rePassword:string

    @IsNotEmpty()
    @IsString()
    @Length(5,5)
    OTP:string
}