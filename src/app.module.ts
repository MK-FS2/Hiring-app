import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevConfigs } from '@Shared/configs';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from '@Shared/Modules';
import { CompanyModule } from './modules/company/company.module';

@Module(
{
  imports:
  [
  ConfigModule.forRoot({isGlobal:true,load:[DevConfigs]}),
  MongooseModule.forRootAsync({imports:[ConfigModule],useFactory:(config:ConfigService)=>({uri:config.get<string>('DB_URL')}),inject:[ConfigService]}),
  GlobalModule,
  AuthModule,
  CompanyModule

  ],
  controllers: []
})
export class AppModule {}
