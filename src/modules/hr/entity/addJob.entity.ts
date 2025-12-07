import { Job } from "@Models/Job";
import { CarerExperienceLevels, Currencies, Degrees, IndustriesFeilds, WorkplaceTypes } from "@Shared/Enums";
import { Types } from "mongoose";



export class AddJobEntity implements Job
{
title:string;
deadline:Date;
description:string;
requirements: string;
skills: string[];
city: string;
country: string;
createdBy: Types.ObjectId;
maxSalary?: number | undefined;
minSalary?: number | undefined;
maxYears: number;
minYears: number;
currency: Currencies;
companyId: Types.ObjectId;
workplaceType: WorkplaceTypes;
industry: IndustriesFeilds;
experienceLevel: CarerExperienceLevels;
degree: Degrees;
}