import { Types } from "mongoose";
import { BaseUserEntity } from "./baseuser.entity";





export class MangerEntity extends BaseUserEntity 
{
companyId: Types.ObjectId;
hireDate:Date;
}