import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevConfigs } from '@Shared/configs';
import { CommonUserModule, GlobalModule } from '@Shared/Modules';
import {minutes,ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {LoggerMiddleware} from '@Shared/Middleware/logger.middleware';
import {ScheduleModule} from '@nestjs/schedule';
import {CronTasksService} from '@Shared/Utils';
import {AdminModule} from '@modules/admin/admin.module';
import {ReportsModule} from '@modules/reports/reports.module';
import {UsersModule} from '@modules/users';
import {HrModule} from '@modules/hr';
import {ApplicantModule} from '@modules/applicant';
import {CompanyModule} from '@modules/company';
import {MangerModule} from '@modules/manger';
import { AuthModule } from '@modules/auth';

  


@Module(
{
  imports:
  [
  ConfigModule.forRoot({isGlobal:true,load:[DevConfigs]}),
  MongooseModule.forRootAsync({imports:[ConfigModule],useFactory:(config:ConfigService)=>({uri:config.get<string>('DB_URL')}),inject:[ConfigService]}),
  ThrottlerModule.forRoot([{ttl:minutes(5),limit:50,},{name:"Auth",limit:5,ttl:minutes(5)}]),
  CommonUserModule,
  GlobalModule,
  ScheduleModule.forRoot(),
  AuthModule,
  CompanyModule,
  MangerModule,
  HrModule,
  ApplicantModule,
  UsersModule,
  ReportsModule,
  AdminModule
  ],
  controllers: [],
  providers:
  [ 
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard,
    },
    CronTasksService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
