import { CarerExperienceLevels, Currencies, Degrees, IndustriesFeilds, WorkplaceTypes } from "@Shared/Enums";
import { Types } from "mongoose";




export class UpdateJobEntity 
{
title:string;
description:string;
requirements: string;
skills: string[];
city: string;
country: string;
maxSalary?: number | undefined;
minSalary?: number | undefined;
maxYears: number;
minYears: number;
currency?:Currencies | undefined;
workplaceType:WorkplaceTypes;
industry:IndustriesFeilds;
experienceLevel: CarerExperienceLevels;
degree:Degrees;
updatedBy: Types.ObjectId | undefined;
}