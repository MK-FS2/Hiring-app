import AbstractRepository from "@Models/AbstractRepository";
import { HR } from "./HR.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class HRRepository extends AbstractRepository<HR>
{
constructor(@InjectModel(HR.name) HRModel:Model<HR>)
{
    super(HRModel)
}

}