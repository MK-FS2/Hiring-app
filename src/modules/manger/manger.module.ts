import { Module } from '@nestjs/common';
import { MangerService } from './manger.service';
import { MangerController } from './manger.controller';
import { CompanyModule } from '@modules/company';
import { MailService } from '@Shared/Utils';
import { CommonUserModule } from '@Shared/Modules';


@Module({
  imports:[CommonUserModule,CompanyModule],
  controllers: [MangerController],
  providers: [MangerService,MailService],
})
export class MangerModule {}
