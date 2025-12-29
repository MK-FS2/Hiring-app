import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { JobRecord } from './jobRecord.schema';




@Injectable()
export class EmployeeActionRepository extends AbstractRepository<JobRecord> 
{
  constructor(@InjectModel(JobRecord.name)private readonly employeeRecordModel:Model<JobRecord>) 
  {
    super(employeeRecordModel);
  }



}
