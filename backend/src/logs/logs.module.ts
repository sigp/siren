import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { UtilsModule } from '../utils/utils.module';
import { LogsService } from './logs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Log])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
