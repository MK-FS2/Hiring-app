import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './factory';
import { CommonUserModule } from '@Shared/Modules';
import { MailService } from '@Shared/Utils';

@Module({
  imports:[CommonUserModule],
  controllers:[AuthController],
  providers: [AuthService,AuthFactory,MailService],
})
export class AuthModule {}
