import AbstractRepository from "@Models/AbstractRepository";
import { User } from "./BaseUser.Schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BaseUserRepository extends AbstractRepository<User>
{
constructor(@InjectModel(User.name)UserModel:Model<User>)
{
super(UserModel)
}
}