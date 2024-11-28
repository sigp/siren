import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [SequelizeModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
