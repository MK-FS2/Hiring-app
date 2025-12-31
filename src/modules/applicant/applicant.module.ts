import { Module} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { CommonUserModule } from '@Shared/Modules';
import { ApplicantFactory } from './factory';
import { CompanyModule } from '@modules/company';
import { AplicationModule, JobModule, JobRecordModule, SavedPostsModule } from '@modules/common';
import { ApplicationRecordModule } from '@modules/common/applicationRecord.module';



@Module({
  imports:[CommonUserModule,ApplicationRecordModule,JobRecordModule,CompanyModule,JobModule,AplicationModule,SavedPostsModule],
  controllers:[ApplicantController],
  providers:[ApplicantService,ApplicantFactory],
})
export class ApplicantModule {}
