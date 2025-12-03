import { Types } from 'mongoose';
import { CompanyRepository } from './../../models/Company/Company.Repository';
import {CanActivate,ConflictException,ExecutionContext,Injectable,NotFoundException,UnauthorizedException,} from '@nestjs/common';



@Injectable()
export class IsEmployeeGuard implements CanActivate 
{
  constructor(private readonly companyRepository: CompanyRepository) {}

  async canActivate(context: ExecutionContext) 
  {
    const req = context.switchToHttp().getRequest();
    const companyId: Types.ObjectId = req.User.companyId;
    const userId: Types.ObjectId = req.User._id;
    if (!companyId) 
    {
      throw new ConflictException('Incomplete data');
    }

    const company = await this.companyRepository.FindOne({_id:companyId},{createdby:1,Hrs:1});

    if (!company) 
    {
      throw new NotFoundException('No company found');
    }

    const isManager = company.createdby?.equals(userId);
    const isHR = company.Hrs?.some((id: Types.ObjectId) => id.equals(userId));

    if (!isManager && !isHR) 
    {
      throw new UnauthorizedException('You are not an employee of this company');
    }
    return true;
  }
}
