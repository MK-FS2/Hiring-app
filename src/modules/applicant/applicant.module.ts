import { Module} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { CommonUserModule } from '@Shared/Modules';
import { ApplicantFactory } from './factory';
import { CompanyModule } from '@modules/company';
import { AplicationModule, JobModule, SavedPostsModule } from '@modules/common';



@Module({
  imports:[CommonUserModule,CompanyModule,JobModule,AplicationModule,SavedPostsModule],
  controllers:[ApplicantController],
  providers:[ApplicantService,ApplicantFactory],
})
export class ApplicantModule {}
