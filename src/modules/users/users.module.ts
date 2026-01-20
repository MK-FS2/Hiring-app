import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonUserModule } from '@Shared/Modules';
import { UserFactory } from './factory';
import { SavedPostsModule } from '@modules/common';

@Module({
  imports:[CommonUserModule,SavedPostsModule],
  controllers: [UsersController],
  providers: [UsersService,UserFactory],
})
export class UsersModule {}
