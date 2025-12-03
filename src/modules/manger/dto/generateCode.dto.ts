import { IsEmail,IsNotEmpty, IsString } from "class-validator";



export class CodeDTO 
{

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    hrEmail:string
}