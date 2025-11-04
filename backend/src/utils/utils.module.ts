import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as http from 'http';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpAgent: new http.Agent({
        keepAlive: false,
        timeout: 5000, // Reduced from 10s to 5s for faster failure detection
      }),
      httpsAgent: new https.Agent({
        keepAlive: false,
        timeout: 5000, // Reduced from 10s to 5s for faster failure detection
      }),
      timeout: 5000, // Reduced from 10s to 5s for faster failure detection
    }),
    CacheModule.register(),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
