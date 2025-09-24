import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT ?? 3000;
  // --- Cuañlquier middleware antes de esto --- //
  await app.listen(PORT);
  console.log(`NestJs Server running onm Port: ${PORT}`);
}
void bootstrap();
