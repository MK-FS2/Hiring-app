import { IsNotEmpty, IsString, Length } from "class-validator";



export class SkillDTO
{
@IsNotEmpty()
@IsString()
@Length(2,60)
skill:string
}