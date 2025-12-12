import { Application } from "@Models/Application";
import { FileSchema } from "@Models/common";
import { Genders } from "@Shared/Enums";
import { Types } from "mongoose";



export class JobApplicationEntity implements Application
{
applicantEmail: string;
applicantPhone: string;
applicantName: string;
applicantGender:Genders;
applicantId: Types.ObjectId;
jobId: Types.ObjectId;
companyId: Types.ObjectId;
cv: FileSchema;
}