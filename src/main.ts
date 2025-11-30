import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const config = app.get(ConfigService)
  const port = Number(config.get("port"))

  await app.listen(port,()=>{console.log(`Server is running on port ${port}`)});
}


// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();