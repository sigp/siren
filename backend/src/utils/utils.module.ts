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
        timeout: 10000,
      }),
      httpsAgent: new https.Agent({ 
        keepAlive: false,
        timeout: 10000,
      }),
      timeout: 10000,
    }),
    CacheModule.register(),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
