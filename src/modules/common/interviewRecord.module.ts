import { InterviewRepository } from "@Models/Interview";
import { InterviewRecord, InterviewRecordSchema } from "@Models/Statistics/InterviewStatistics";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";




@Module({
imports:[MongooseModule.forFeature([{name:InterviewRecord.name,schema:InterviewRecordSchema}])],
providers:[InterviewRepository],
exports:[InterviewRepository]
})
export class InterviewReportModule {}