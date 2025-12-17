import { Interview, InterviewRepository, InterviewSchema } from "@Models/Interview";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
imports:[MongooseModule.forFeature([{name:Interview.name,schema:InterviewSchema}])],
providers:[InterviewRepository],
exports:[InterviewRepository]
})
export class InterviewModule{}