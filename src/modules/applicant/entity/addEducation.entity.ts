import { EducationSchema } from "@Models/Users";
import { Degrees } from "@Shared/Enums";




export class EducationEntity implements EducationSchema
{
startDate: Date;
endDate: Date;
degree: Degrees;
institution: string;
}