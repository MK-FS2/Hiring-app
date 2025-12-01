import AbstractRepository from "@Models/AbstractRepository";
import { Applicant } from "./Applicant.Schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ApplicantRepository extends AbstractRepository<Applicant>
{
constructor(@InjectModel(Applicant.name) private readonly ApplicantModel:Model<Applicant>)
{
super(ApplicantModel)
}
}