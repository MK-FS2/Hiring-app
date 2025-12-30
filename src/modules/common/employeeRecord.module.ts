import { EmployeeRecord, EmployeeRecordRepository, EmployeeRecordSchema } from "@Models/Statistics/EmployeeStatistics/EmployeeRecord";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
imports:[MongooseModule.forFeature([{name:EmployeeRecord.name,schema:EmployeeRecordSchema}])],
providers:[EmployeeRecordRepository],
exports:[EmployeeRecordRepository]
})
export class EmployeeRecordModule{}