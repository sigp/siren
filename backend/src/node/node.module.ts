import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { UtilsModule } from '../utils/utils.module';
import { NodeController } from './node.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '../auth.module';

@Module({
  imports: [UtilsModule, CacheModule.register(), AuthModule],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
