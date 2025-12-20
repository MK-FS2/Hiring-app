import { InjectModel } from "@nestjs/mongoose";
import { SavedPosts } from "./savedposts.Schema";
import { Model } from "mongoose";
import AbstractRepository from "@Models/AbstractRepository";



export class SavedPostsRepository extends AbstractRepository<SavedPosts>
{
    constructor(@InjectModel(SavedPosts.name) private readonly SavedPostsModel:Model<SavedPosts>)
    {
     super(SavedPostsModel)
    }
}