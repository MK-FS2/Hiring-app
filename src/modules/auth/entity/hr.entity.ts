import { BaseUserEntity } from "./baseuser.entity";
import { Types } from "mongoose";


export class HREntity extends BaseUserEntity 
{
companyId:Types.ObjectId;
hireDate: Date;
}