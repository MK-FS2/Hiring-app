import { InterviewRecord, InterviewRecordRepository, InterviewRecordSchema } from "@Models/Statistics/InterviewStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";




@Module({
imports:[MongooseModule.forFeature([{name:InterviewRecord.name,schema:InterviewRecordSchema}])],
providers:[InterviewRecordRepository],
exports:[InterviewRecordRepository]
})
export class InterviewReportModule{}