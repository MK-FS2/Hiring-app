import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonUserModule } from '@Shared/Modules';
import { UserFactory } from './factory';

@Module({
  imports:[CommonUserModule],
  controllers: [UsersController],
  providers: [UsersService,UserFactory],
})
export class UsersModule {}
