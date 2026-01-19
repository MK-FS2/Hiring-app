/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomException } from '@Shared/Filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));

  app.useGlobalFilters(new CustomException());

  app.enableCors({origin:'*',methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',credentials: false});
  const config = app.get(ConfigService);
  const port = Number(config.get('port')) || 5000;

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}

bootstrap();
