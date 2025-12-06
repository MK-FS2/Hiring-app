import { Controller, Get, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { FullGuard, SetPermissions } from '@Shared/Decorators';
import { ApprovedCompanyGuard, HRPermissionGuard, IsEmployeeGuard } from '@Shared/Guards';
import { HRPermissions, Roles } from '@Shared/Enums';


@UseGuards(ApprovedCompanyGuard,IsEmployeeGuard,HRPermissionGuard)
@FullGuard(Roles.HR)
@Controller('hr')
export class HrController 
{
  constructor(private readonly hrService: HrService) 
  {}

 @SetPermissions(HRPermissions.DeleteJobs)
 @Get()
 t1()
 {
  return {m:"yas"}
 }

}
