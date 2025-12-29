import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ApplicationRecord } from './applicationSatristics.schema';





@Injectable()
export class EmployeeActionRepository extends AbstractRepository<ApplicationRecord> 
{
  constructor(@InjectModel(ApplicationRecord.name)private readonly ApplicationRecordModel:Model<ApplicationRecord>) 
  {
    super(ApplicationRecordModel);
  }


}