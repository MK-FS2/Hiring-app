import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';
import { CarerExperienceLevels, IndustriesFeilds } from '@Shared/Enums';

@Schema({ timestamps: true })
export class JobRecord 
{
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User' })
  creatorId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  timesRejected: number;

  @Prop({ type: String, enum: IndustriesFeilds, required: true })
  jobIndustry: IndustriesFeilds;

  @Prop({ type: String, enum: CarerExperienceLevels, required: true })
  requiredLevel: CarerExperienceLevels;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  saves: number;

  @Prop({ type: Number, default: 0 })
  applies: number;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;
}

export const JobRecordSchema = SchemaFactory.createForClass(JobRecord);
