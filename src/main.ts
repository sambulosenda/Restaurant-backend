import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtMiddlewear } from './jwt/jwt.middlewear';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes (
    new ValidationPipe()
  )
  await app.listen(3000);
}
bootstrap();


