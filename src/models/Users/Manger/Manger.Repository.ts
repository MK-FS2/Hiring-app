import AbstractRepository from "@Models/AbstractRepository";
import { Manger } from "./Manger.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MangerRepository extends AbstractRepository<Manger>
{
    constructor(@InjectModel(Manger.name)MangerModel:Model<Manger>)
    {
    super(MangerModel)
    }
}