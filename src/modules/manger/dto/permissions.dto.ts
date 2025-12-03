import { HRPermissions } from "@Shared/Enums";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsMongoId, IsNotEmpty} from "class-validator";
import { Types } from "mongoose";




export  class PermissionsDTO 
{
@IsNotEmpty()
@IsArray()
@IsEnum(HRPermissions,{each:true})
Permissions:string[]

@IsNotEmpty()
@IsMongoId()
@Type(()=> Types.ObjectId)
hrId:Types.ObjectId
}