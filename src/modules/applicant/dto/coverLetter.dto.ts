import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";


export class CoverLetterDTO 
{

    @IsNotEmpty()
    @IsString()
    @Length(1,50)
    @IsOptional()
    CoverLetter:string
}