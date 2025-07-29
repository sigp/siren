import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExcludeStatus } from './entities/exclude-status.entity';
import { ExcludeStatusController } from './exclude-status.controller';
import { ExcludeStatusService } from './exclude-status.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [SequelizeModule.forFeature([ExcludeStatus]), AuthModule],
  controllers: [ExcludeStatusController],
  providers: [ExcludeStatusService],
  exports: [ExcludeStatusService],
})
export class ExcludeStatusModule {}
