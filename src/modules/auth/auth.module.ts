import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './factory';
import { CommonUserModule } from '@Shared/Modules';
import { MailService } from '@Shared/Utils';
import { CompanyModule } from '@modules/company';





@Module({
  imports:[CommonUserModule,CompanyModule],
  controllers:[AuthController],
  providers: [AuthService,AuthFactory,MailService],
})
export class AuthModule {}
