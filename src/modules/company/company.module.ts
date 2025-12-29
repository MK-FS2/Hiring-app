import {Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CommonUserModule } from '@Shared/Modules';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanyRepository, CompanySchema } from '@Models/Company';
import { CompanyFactory } from './factory';
import { JobModule } from '@modules/common';


@Module({
  imports:[CommonUserModule,JobModule,MongooseModule.forFeature([{name:Company.name,schema:CompanySchema}])],
  controllers:[CompanyController],
  providers: [CompanyService,CompanyRepository,CompanyFactory],
  exports:[CompanyRepository]
})
export class CompanyModule {}
