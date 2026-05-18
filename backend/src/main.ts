import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { BACKEND_PORT } from '../../src/constants/envars';

// Global error handlers to prevent process termination
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Process will continue running...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('Process will continue running...');
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    setupGracefulShutdown({ app });
    await app.listen(BACKEND_PORT);
    console.log(`Backend server is running on port ${BACKEND_PORT}`);
  } catch (error) {
    console.error('Failed to start backend server:', error);
    console.error('Retrying in 5 seconds...');
    setTimeout(() => {
      bootstrap();
    }, 5000);
  }
}

bootstrap();
