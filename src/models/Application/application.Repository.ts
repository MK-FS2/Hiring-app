import AbstractRepository from '@Models/AbstractRepository';
import { Application } from './application.Schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



export class ApplicationRepository extends AbstractRepository<Application>
{
constructor(@InjectModel(Application.name)private readonly ApplicationModel:Model<Application>)
{
    super(ApplicationModel)
}
}