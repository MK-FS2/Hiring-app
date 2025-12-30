import { JobRecord, JobRecordRepository, JobRecordSchema } from "@Models/Statistics/JobStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";



@Module(
{
imports:[MongooseModule.forFeature([{name:JobRecord.name,schema:JobRecordSchema}])],
providers:[JobRecordRepository],
exports:[JobRecordRepository]
})
export class JobRecordModule{}