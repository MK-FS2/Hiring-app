import { HRPermissions } from "@Shared/Enums";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";



export class RevokePermissionDTO 
{

@IsNotEmpty()
@IsString()
@IsEnum(HRPermissions)
permission:HRPermissions

@IsNotEmpty()
@IsMongoId()
@Type(()=> Types.ObjectId)
hrId:Types.ObjectId
}