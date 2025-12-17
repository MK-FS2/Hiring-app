import { Interview } from "@Models/Interview";
import { Types } from "mongoose";



export class CreateInterviewEntity implements Interview
{
    jobId: Types.ObjectId;
    companyId: Types.ObjectId;
    applicationId: Types.ObjectId;
}