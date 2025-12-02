import { Addressschema } from "@Models/common";
import { Company } from "@Models/Company";
import { IndustriesFeilds } from "@Shared/Enums";
import { Types } from "mongoose";



export class CreateCompanyEntity implements Company
{ 
companyname:string;
description: string;
Companyemail: string;
indstry:IndustriesFeilds;
address:Addressschema;
createdby:Types.ObjectId 
}