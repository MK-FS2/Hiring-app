import { BaseUserDTO } from "./baseuser.dto";
import { Types } from "mongoose";
import { IsDate, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ISPastDate } from "@Shared/Validations";




export class HRDTO extends BaseUserDTO 
{
@IsNotEmpty()
@IsMongoId()
companyId: Types.ObjectId;

@IsNotEmpty()
@IsDate()
@IsString()
@ISPastDate()
hireDate: Date;
}