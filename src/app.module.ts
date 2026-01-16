import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevConfigs } from '@Shared/configs';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from '@Shared/Modules';
import { CompanyModule } from './modules/company/company.module';
import { MangerModule } from './modules/manger/manger.module';
import {HrModule} from './modules/hr/hr.module';
import {ApplicantModule} from './modules/applicant/applicant.module';
import {UsersModule} from './modules/users/users.module';
import {ReportsModule} from './modules/reports/reports.module';
import {minutes,ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';

  


@Module(
{
  imports:
  [
  ConfigModule.forRoot({isGlobal:true,load:[DevConfigs]}),
  MongooseModule.forRootAsync({imports:[ConfigModule],useFactory:(config:ConfigService)=>({uri:config.get<string>('DB_URL')}),inject:[ConfigService]}),
  ThrottlerModule.forRoot([{ttl:minutes(5),limit:50,},{name:"Auth",limit:5,ttl:minutes(5)}]),
  GlobalModule,
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
  ]
})
export class AppModule {}
