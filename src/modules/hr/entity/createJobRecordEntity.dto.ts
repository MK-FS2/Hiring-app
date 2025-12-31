import { JobRecord } from "@Models/Statistics/JobStatistics";
import { CarerExperienceLevels, IndustriesFeilds, WorkplaceTypes } from "@Shared/Enums";
import { Types } from "mongoose";




export class JobRecordEntity implements JobRecord
{
    companyId: Types.ObjectId;
    jobId: Types.ObjectId;
    creatorId: Types.ObjectId;
    jobIndustry: IndustriesFeilds;
    requiredCarerLevel: CarerExperienceLevels;
    workplaceType: WorkplaceTypes;
}