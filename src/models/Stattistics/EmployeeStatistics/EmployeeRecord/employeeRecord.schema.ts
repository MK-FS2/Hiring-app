import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class EmployeeRecord 
{
  @Prop({type:SchemaTypes.ObjectId,required:true,ref:'Company'})
  companyId: Types.ObjectId;

  @Prop({type:SchemaTypes.ObjectId,required:true,ref:'HR'})
  employeeId: Types.ObjectId;

  @Prop({type:Date,default:()=>new Date()})
  joinedAt:Date;
}

export const EmployeeRecordSchema = SchemaFactory.createForClass(EmployeeRecord);

