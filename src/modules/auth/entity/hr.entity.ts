import { Types } from "mongoose";
import { BaseUserEntity } from "./baseuser.entity";
;


export class HREntity extends BaseUserEntity 
{
code:string
hireDate: Date;
companyId:Types.ObjectId
}