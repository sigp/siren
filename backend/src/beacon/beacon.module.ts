import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { UtilsModule } from '../utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import {AuthModule} from "../auth.module";

@Module({
  imports: [UtilsModule, CacheModule.register(), AuthModule],
  controllers: [BeaconController],
  providers: [BeaconService],
})
export class BeaconModule {}
