import { CompanyModule } from './../company/company.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CommonUserModule } from '@Shared/Modules';
import { MailService } from '@Shared/Utils';

@Module({
  imports:[CommonUserModule,CompanyModule],
  controllers: [AdminController],
  providers: [AdminService,MailService],
})
export class AdminModule {}
