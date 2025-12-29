import AbstractRepository from '@Models/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InterviewRecord } from './interviewStatistics.schema';


@Injectable()
export class InterviewRepository extends AbstractRepository<InterviewRecord>
{
constructor(@InjectModel(InterviewRecord.name) private readonly interviewModel:Model<InterviewRecord>,
)
{
super(interviewModel);
}
}