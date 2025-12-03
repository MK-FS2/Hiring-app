import { BaseUserDTO } from "./baseuser.dto";
import {IsNotEmpty, IsString, Length } from "class-validator";





export class HRDTO extends BaseUserDTO 
{
@IsNotEmpty()
@IsString()
@Length(5,5)
code:string;
}