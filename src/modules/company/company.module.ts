import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CommonUserModule } from '@Shared/Modules';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from '@Models/Company';

@Module({
  imports:[CommonUserModule,MongooseModule.forFeature([{name:Company.name,schema:CompanySchema}])],
  controllers:[CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
