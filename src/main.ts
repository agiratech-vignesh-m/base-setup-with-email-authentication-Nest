import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Setting the global prefix as api
  app.setGlobalPrefix('api');

  // Setting the API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  // Validator
  // Used to validate the request body
  app.useGlobalPipes(new ValidationPipe());

  // Cors
  app.enableCors();

  // Static public folder
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/api/static',
  });

  await app.listen(5000, () => {
    console.log("Server connected successfully")
  });
}
bootstrap();
