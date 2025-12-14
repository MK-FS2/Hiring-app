import { ApplicationRepository } from './../../models/Application/application.Repository';
import { Application, ApplicationSchema } from "@Models/Application";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module(
{
imports:[MongooseModule.forFeature([{name:Application.name,schema:ApplicationSchema}])],
providers:[ApplicationRepository],
exports:[ApplicationRepository]
})
export class AplicationModule{}