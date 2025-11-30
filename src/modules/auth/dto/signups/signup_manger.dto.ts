import { Manger } from "@Models/Users";
import { BaseUserDTO } from "./baseuser.dto";
import { Types } from "mongoose";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { ISPastDate } from "@Shared/Validations";



export class MangerDTO extends BaseUserDTO implements Manger
{

@IsNotEmpty()
companyId: Types.ObjectId;

@IsNotEmpty()
@IsDate()
@IsString()
@ISPastDate()
hireDate: Date;
}