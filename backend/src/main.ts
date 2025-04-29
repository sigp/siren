import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { BACKEND_PORT } from '../../src/constants/envars';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupGracefulShutdown({ app });
  await app.listen(BACKEND_PORT);
}
bootstrap();
