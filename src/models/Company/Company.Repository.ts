import AbstractRepository from "@Models/AbstractRepository";
import { Company } from "./Company.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";




@Injectable()
export class CompanyRepository extends AbstractRepository<Company> 
{
constructor(@InjectModel(Company.name) private readonly CompanyModel:Model<Company>)
{
super(CompanyModel)
}
}