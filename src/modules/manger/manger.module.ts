import { Module } from '@nestjs/common';
import { MangerService } from './manger.service';
import { MangerController } from './manger.controller';
import { CompanyModule } from '@modules/company';
import { MailService } from '@Shared/Utils';
import { CommonUserModule } from '@Shared/Modules';
import { EmployeeActionModule, EmployeeRecordModule, JobModule, JobRecordModule } from '@modules/common';
import { HrModule } from '@modules/hr';



@Module({
  imports:[CommonUserModule,CompanyModule,JobModule,HrModule,JobRecordModule,EmployeeRecordModule,EmployeeActionModule],
  controllers: [MangerController],
  providers: [MangerService,MailService],
})
export class MangerModule {}
