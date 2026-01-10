/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApplicationRecordRepository } from "@Models/Statistics/ApplicationStatistics";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";



@Injectable()
export class ApplicationReportService 
{

constructor(private readonly applicationRecordRepository:ApplicationRecordRepository){}

async OverAllApplicationQuality(companyId:Types.ObjectId)
{
const data = await this.applicationRecordRepository.OverAllApplicationsQualityRatio(companyId)
return data
}


async AverageProcessingTime(companyId:Types.ObjectId)
{
    const data= await this.applicationRecordRepository.AverageProcessingTime(companyId)
    return data
}

}