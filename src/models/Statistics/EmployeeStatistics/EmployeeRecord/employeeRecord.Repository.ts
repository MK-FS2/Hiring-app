import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { EmployeeRecord } from './employeeRecord.schema';



@Injectable()
export class EmployeeRecordRepository extends AbstractRepository<EmployeeRecord> 
{
  constructor(@InjectModel(EmployeeRecord.name)private readonly employeeRecordModel:Model<EmployeeRecord>) 
  {
    super(employeeRecordModel);
  }

async CreateEmployeeRecord(companyId:Types.ObjectId,employeeId:Types.ObjectId) 
{
  return this.CreatDocument({companyId,employeeId,joinedAt:new Date()});
}

}
