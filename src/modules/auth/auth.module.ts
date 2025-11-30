import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactory } from './factory';

@Module({
  controllers: [AuthController],
  providers: [AuthService,AuthFactory],
})
export class AuthModule {}
