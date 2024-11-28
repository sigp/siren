import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Metric } from '../validator/entities/metric.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { LogsModule } from '../logs/logs.module';
import { Log } from '../logs/entities/log.entity';

@Module({
  imports: [
    UtilsModule,
    LogsModule,
    CacheModule.register(),
    SequelizeModule.forFeature([Metric, Log]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
