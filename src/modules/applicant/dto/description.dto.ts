import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";




export class DescriptionDTO 
{
@IsString()
@IsNotEmpty()
@Length(2,400)
@IsOptional()
description:string
}