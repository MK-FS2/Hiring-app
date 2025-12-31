import { Types } from 'mongoose';
import { Genders, IndustriesFeilds } from '@Shared/Enums';
import { ApplicationRecord } from '@Models/Statistics/ApplicationStatistics';

export class ApplicationRecordEntity implements  ApplicationRecord 
{
  jobId: Types.ObjectId;
  applicationId:Types.ObjectId
  companyId: Types.ObjectId;
  applicantId: Types.ObjectId;
  applicantIndustry: IndustriesFeilds;
  applicantGender: Genders;
  applicationOutcome?: boolean;
  appliedAt?: Date;
}