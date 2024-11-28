import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
