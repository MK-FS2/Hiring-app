import { CompanyRepository } from './../../../models/Company/Company.Repository';
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EmployeeActionRepository } from '@Models/Statistics/EmployeeStatistics/EmployeeActions';
import {Injectable, NotFoundException} from '@nestjs/common';
import {Types} from 'mongoose';
import { OptionalInterval } from '../dto';

@Injectable()
export class EmployeeReportService 
{
constructor(private readonly employeeActionRepository:EmployeeActionRepository, private readonly companyRepository:CompanyRepository){}

private async cheackExist(employeeId:Types.ObjectId,companyId:Types.ObjectId)
{
const exist = await this.companyRepository.FindOne({_id:companyId,Hrs:{$in:employeeId}})
if(!exist)throw new NotFoundException("No Employee Found")
return true
}

async EmployeeActivitySummary(employeeId:Types.ObjectId,companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
await this.cheackExist(employeeId,companyId)

const data = await this.employeeActionRepository.EmployeeActivitySummary(employeeId,companyId,optionalInterval)
return data
}

async EmployeeProductivity(employeeId:Types.ObjectId,companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
await this.cheackExist(employeeId,companyId)

const data = await this.employeeActionRepository.EmployeeProductivity(employeeId,companyId,optionalInterval)
return data
}

async EmployeeActionTimeline(employeeId:Types.ObjectId,companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
await this.cheackExist(employeeId,companyId)

const data = await this.employeeActionRepository.EmployeeActionTimeline(employeeId,companyId,optionalInterval)
return data
}

async EmployeePerformanceScore(employeeId:Types.ObjectId,companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
await this.cheackExist(employeeId,companyId)

const data = await this.employeeActionRepository.EmployeePerformanceScore(employeeId,companyId,optionalInterval)
return data
}

async EmployeeActionTypeBreakdown(employeeId:Types.ObjectId,companyId:Types.ObjectId,optionalInterval?:OptionalInterval)
{
await this.cheackExist(employeeId,companyId)

const data = await this.employeeActionRepository.EmployeeActionTypeBreakdown(employeeId,companyId,optionalInterval)
return data
}

}