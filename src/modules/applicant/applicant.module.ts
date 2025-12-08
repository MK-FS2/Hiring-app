import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { CommonUserModule } from '@Shared/Modules';
import { HrModule } from '@modules/hr';
import { ApplicantFactory } from './factory';



@Module({
  imports:[HrModule,CommonUserModule],
  controllers:[ApplicantController],
  providers: [ApplicantService,ApplicantFactory],
})
export class ApplicantModule {}
