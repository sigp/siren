import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';
import { UtilsModule } from '../utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth.module';
import { ExcludeStatusModule } from '../exclude-status/exclude-status.module';

@Module({
  imports: [
    UtilsModule,
    ActivityModule,
    CacheModule.register(),
    AuthModule,
    ExcludeStatusModule,
  ],
  controllers: [ValidatorController],
  providers: [ValidatorService],
})
export class ValidatorModule {}
