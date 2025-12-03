import { CompanyRepository } from "@Models/Company";
import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Types } from "mongoose";


@Injectable()
export class ApprovedCompanyGuard implements CanActivate
{
    constructor(private readonly companyRepository:CompanyRepository){}

    async canActivate(context:ExecutionContext)
    {
     const req = context.switchToHttp().getRequest()
     const companyId:Types.ObjectId = req.User.companyId
     const company = await this.companyRepository.FindOne({_id:companyId})
     if(!company)
     {
        throw new NotFoundException("No company found")
     }

    if(!company.approvedByAdmin)
    {
        throw new UnauthorizedException("Company is not yet approved")
    }
    return true
    }
}