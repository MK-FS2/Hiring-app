import { EmployeeActionRepository } from "@Models/Statistics/ApplicationStatistics";
import { EmployeeRecord, EmployeeRecordSchema } from "@Models/Statistics/EmployeeStatistics/EmployeeRecord";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
imports:[MongooseModule.forFeature([{name:EmployeeRecord.name,schema:EmployeeRecordSchema}])],
providers:[EmployeeActionRepository],
exports:[EmployeeActionRepository]
})
export class EmployeeRecordModule{}