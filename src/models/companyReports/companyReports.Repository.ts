import AbstractRepository from "@Models/AbstractRepository";
import { CompanyStatistics } from "./companyReports.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";



export class CompanyReportsRepository extends AbstractRepository<CompanyStatistics>
{
constructor(@InjectModel(CompanyStatistics.name) private readonly CompanyStatisticsModel:Model<CompanyStatistics>)
{
 super(CompanyStatisticsModel)
}


}