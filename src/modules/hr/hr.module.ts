import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { CommonUserModule } from '@Shared/Modules';
import { CompanyModule } from '@modules/company';
import { HRFactory } from './factory';
import { AplicationModule, InterviewModule, JobModule, SavedPostsModule } from '@modules/common';
import { MailService } from '@Shared/Utils';

@Module({
  imports:[CommonUserModule,CompanyModule,JobModule,AplicationModule,InterviewModule,SavedPostsModule],
  controllers:[HrController],
  providers: [HrService,HRFactory,MailService],
})
export class HrModule {}
