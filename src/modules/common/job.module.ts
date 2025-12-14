import { Job, JobRepository, JobSchema } from "@Models/Job";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";



@Module(
{
imports:[MongooseModule.forFeature([{name:Job.name,schema:JobSchema}])],
providers:[JobRepository],
exports:[JobRepository]
})
export class JobModule{}