import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { EmployeeAction } from './employeeActions.Schema';


@Injectable()
export class EmployeeActionRepository extends AbstractRepository<EmployeeAction> 
{
  constructor(@InjectModel(EmployeeAction.name)private readonly employeeActionModel: Model<EmployeeAction>) 
  {
    super(employeeActionModel);
  }



}
