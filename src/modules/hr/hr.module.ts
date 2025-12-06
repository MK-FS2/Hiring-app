import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { CommonUserModule } from '@Shared/Modules';
import { CompanyModule } from '@modules/company';

@Module({
  imports:[CommonUserModule,CompanyModule],
  controllers:[HrController],
  providers: [HrService],
})
export class HrModule {}
