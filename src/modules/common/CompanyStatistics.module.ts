import { CompanyReportsRepository, CompanyStatistics, CompanyStatisticsSchema } from "@Models/companyReports";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";




@Module(
{
imports:[MongooseModule.forFeature([{name:CompanyStatistics.name,schema:CompanyStatisticsSchema}])],
providers:[CompanyReportsRepository],
exports:[CompanyReportsRepository]
})
export class CompanyStatisticsModule {}