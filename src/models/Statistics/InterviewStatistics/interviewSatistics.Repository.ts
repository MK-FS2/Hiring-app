import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterviewRecord } from './interviewStatistics.schema';
import { InterviewRecordEntity } from '@modules/hr';



@Injectable()
export class InterviewRecordRepository extends AbstractRepository<InterviewRecord>
{
constructor(@InjectModel(InterviewRecord.name) private readonly interviewRecordModel:Model<InterviewRecord>,
)
{
super(interviewRecordModel);
}

async AddRecord(interviewRecordEntity:InterviewRecordEntity)
{
const result = await this.CreatDocument(interviewRecordEntity)
return result
}

}