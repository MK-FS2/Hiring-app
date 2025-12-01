import { EmailRegex} from "@Shared/Validations"
import { IsNotEmpty, IsString, Matches } from "class-validator"



export class LoginDTO 
{
    @IsNotEmpty()
    @IsString()
    @Matches(EmailRegex,{ message: 'Email format is invalid' })
    email:string
     
    @IsNotEmpty()
    @IsString()
    password:string
}