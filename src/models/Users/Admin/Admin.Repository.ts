import AbstractRepository from "@Models/AbstractRepository";
import { Admin } from "./Admin.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminRepositoriy extends AbstractRepository<Admin>
{
constructor(@InjectModel(Admin.name)AdminModel:Model<Admin>)
{
super(AdminModel)
}
}