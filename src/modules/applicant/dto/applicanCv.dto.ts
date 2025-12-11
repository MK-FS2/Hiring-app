import { IsNotEmpty, IsString, Length } from "class-validator";



export class CvDTO 
{
 @IsNotEmpty()
 @IsString()
 @Length(2,20)
 cvName:string
}