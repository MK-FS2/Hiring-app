import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { EmployeeRecord } from './employeeRecord.schema';



@Injectable()
export class EmployeeActionRepository extends AbstractRepository<EmployeeRecord> 
{
  constructor(@InjectModel(EmployeeRecord.name)private readonly employeeRecordModel:Model<EmployeeRecord>) 
  {
    super(employeeRecordModel);
  }



}
