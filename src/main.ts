import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomException } from '@Shared/Filters';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);

 
  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));

  app.useGlobalFilters(new CustomException());

  const config = app.get(ConfigService)
  const port = Number(config.get("port"))

  await app.listen(port,()=>{console.log(`Server is running on port ${port}`)});
}


// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();