import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { EmployeeAction } from './employeeActions.Schema';
import { HrActionsTypes } from '@Shared/Enums';


@Injectable()
export class EmployeeActionRepository extends AbstractRepository<EmployeeAction> 
{
  constructor(@InjectModel(EmployeeAction.name)private readonly employeeActionModel: Model<EmployeeAction>) 
  {
    super(employeeActionModel);
  }

async RecordAction(employeeId:Types.ObjectId,targetType:HrActionsTypes)
{
const result = await this.CreatDocument({employeeId,targetType})
return result 
}

}
