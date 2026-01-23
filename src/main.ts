import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomException } from '@Shared/Filters';

async function bootstrap() 
{
  try 
  {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new CustomException());
    app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: false });

    const port = Number(process.env.PORT) || 5000;
    await app.listen(port, '0.0.0.0');
    console.log(`Server running on port ${port}`);
  } 
  catch (err) 
  {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
