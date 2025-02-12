import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { AuthModule } from '../auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Activity]), AuthModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
