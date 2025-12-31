import { JobRecordEntity } from './../../../modules/hr/entity/createJobRecordEntity.dto';
import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { JobRecord } from './jobRecord.schema';




@Injectable()
export class JobRecordRepository extends AbstractRepository<JobRecord> 
{
  constructor(@InjectModel(JobRecord.name)private readonly jobRecordModel:Model<JobRecord>) 
  {
    super(jobRecordModel);
  }

 async AddRecord(jobRecordEntity:JobRecordEntity)
 {
  const result = await this.CreatDocument(jobRecordEntity)
  return result
 }

}
