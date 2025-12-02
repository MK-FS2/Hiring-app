import { Types } from 'mongoose';
import { CreateCompanyDTO } from '../dto';
import { CreateCompanyEntity } from '../entity';
import { Injectable } from '@nestjs/common';


@Injectable()
export class CompanyFactory 
{
 CreateCompany(createCompanyDTO:CreateCompanyDTO,userid:Types.ObjectId)
{
const company = new CreateCompanyEntity()

company.Companyemail = createCompanyDTO.Companyemail
company.companyname  = createCompanyDTO.companyname
company.indstry  = createCompanyDTO.indstry
company.description = createCompanyDTO.description
company.address = 
{
    city:createCompanyDTO.city,
    state:createCompanyDTO.state,
    country:createCompanyDTO.country,
    street:createCompanyDTO.street
}    
company.createdby = userid
return company
}


}