import AbstractRepository from '@Models/AbstractRepository';
import { EmployeeAction } from '@Models/companyReports';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';


@Injectable()
export class EmployeeActionRepository extends AbstractRepository<EmployeeAction> 
{
  constructor(@InjectModel(EmployeeAction.name)private readonly employeeActionModel: Model<EmployeeAction>) 
  {
    super(employeeActionModel);
  }



}
