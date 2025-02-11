import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { UtilsModule } from '../utils/utils.module';
import { LogsService } from './logs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import {AuthModule} from "../auth.module";

@Module({
  imports: [UtilsModule, SequelizeModule.forFeature([Log]), AuthModule],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
