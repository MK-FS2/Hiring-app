import { Controller, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@Shared/Guards';

@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController 
{
  constructor(private readonly companyService: CompanyService) {}
}
