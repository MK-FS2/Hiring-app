import { ApplicationRecordSchema, EmployeeActionRepository } from "@Models/Statistics/ApplicationStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";





@Module({
imports:[MongooseModule.forFeature([{name:ApplicationRecord.name,schema:ApplicationRecordSchema}])],
providers:[EmployeeActionRepository],
exports:[EmployeeActionRepository]
})
export class ApplicationRecord {}