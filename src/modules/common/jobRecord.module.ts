import { EmployeeActionRepository } from "@Models/Statistics/ApplicationStatistics";
import { JobRecord, JobRecordSchema } from "@Models/Statistics/JobStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";



@Module(
{
imports:[MongooseModule.forFeature([{name:JobRecord.name,schema:JobRecordSchema}])],
providers:[EmployeeActionRepository],
exports:[EmployeeActionRepository]
})
export class JobRecordModule{}