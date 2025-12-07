import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { CommonUserModule } from '@Shared/Modules';
import { CompanyModule } from '@modules/company';
import { HRFactory } from './factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobRepository, JobSchema } from '@Models/Job';

@Module({
  imports:[CommonUserModule,CompanyModule,MongooseModule.forFeature([{name:Job.name,schema:JobSchema}])],
  controllers:[HrController],
  providers: [HrService,HRFactory,JobRepository],
})
export class HrModule {}
