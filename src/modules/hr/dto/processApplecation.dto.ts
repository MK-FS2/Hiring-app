import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';



export class ProcessAplicationDTO 
{
@IsNotEmpty()
@IsMongoId()
jobId:Types.ObjectId

@IsNotEmpty()
@IsMongoId()
applicationId:Types.ObjectId

@IsNotEmpty()
@IsBoolean()
decision:boolean
}