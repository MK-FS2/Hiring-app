import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { CommonUserModule } from '@Shared/Modules';
import { HrModule } from '@modules/hr';
import { ApplicantFactory } from './factory';
import { CompanyModule } from '@modules/company';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationRepository, ApplicationSchema } from '@Models/Application';



@Module({
  imports:[HrModule,CommonUserModule,HrModule,CompanyModule,MongooseModule.forFeature([{name:Application.name,schema:ApplicationSchema}])],
  controllers:[ApplicantController],
  providers: [ApplicantService,ApplicantFactory,ApplicationRepository],
})
export class ApplicantModule {}
