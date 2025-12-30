// employee-action.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { HrActionsTypes } from '@Shared/Enums';

@Schema({ timestamps: true })
export class EmployeeAction 
{
  @Prop({type:SchemaTypes.ObjectId,required:true})
  employeeId:Types.ObjectId;

  @Prop({type:Date,default:()=>new Date()})
  doneAt: Date;

  @Prop({type:String,enum:HrActionsTypes,required:true})
  targetType: HrActionsTypes;
}

export const EmployeeActionSchema = SchemaFactory.createForClass(EmployeeAction);