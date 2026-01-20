/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomException } from '@Shared/Filters';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.useGlobalFilters(new CustomException());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false
  });

  // ===== DEPLOYMENT (Railway) =====
  const port = Number(process.env.PORT) || 5000;
  
  // ===== LOCAL DEVELOPMENT =====
  // const config = app.get(ConfigService);
  // const port = Number(config.get('port')) || 5000;

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}

bootstrap();