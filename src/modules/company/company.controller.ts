import { Controller, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@Shared/Guards';
import { RoleGuard } from '@Shared/Guards/role.guard';
import { RolesAllowed } from '@Shared/Decorators';
import { Roles } from '@Shared/Enums';

@RolesAllowed(Roles.Manger)
@UseGuards(AuthGuard,RoleGuard)
@Controller('company')
export class CompanyController 
{
  constructor(private readonly companyService: CompanyService) {}
}
