import { forwardRef, Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { CommonUserModule } from '@Shared/Modules';
import { CompanyModule } from '@modules/company';
import { HRFactory } from './factory';
import { AplicationModule, JobModule } from '@modules/common';

@Module({
  imports:[CommonUserModule,forwardRef(()=>CompanyModule),JobModule,AplicationModule],
  controllers:[HrController],
  providers: [HrService,HRFactory],
})
export class HrModule {}
