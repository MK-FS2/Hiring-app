import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { ApplicationRecord } from './applicationSatristics.schema';
import { ApplicationRecordEntity } from '@modules/applicant';





@Injectable()
export class ApplicationRecordRepository extends AbstractRepository<ApplicationRecord> 
{
  constructor(@InjectModel(ApplicationRecord.name)private readonly ApplicationRecordModel:Model<ApplicationRecord>) 
  {
    super(ApplicationRecordModel);
  }

 async AddRecord(applicationRecordEntity:ApplicationRecordEntity)
 {
  const result = await this.CreatDocument(applicationRecordEntity)
  return result
 }

}