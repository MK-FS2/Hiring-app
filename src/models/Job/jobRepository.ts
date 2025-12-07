import AbstractRepository from "@Models/AbstractRepository";
import { Job } from "./jobSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";




export class JobRepository extends AbstractRepository<Job>
{
    constructor(@InjectModel(Job.name) private readonly JobModel:Model<Job>)
    {
        super(JobModel)
    }

}