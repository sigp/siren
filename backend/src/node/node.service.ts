import { Inject, Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import getPercentage from '../../../utilities/getPercentage';
import formatGigBytes from '../../../utilities/formatGigBytes';
import { StatusColor } from '../../../src/types';
import secondsToShortHand from '../../../utilities/secondsToShortHand';
import { throwServerError } from '../utilities';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Diagnostics } from '../../../src/types/diagnostic';

@Injectable()
export class NodeService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private utilsService: UtilsService,
  ) {}
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private beaconUrl = process.env.BEACON_URL;

  async fetchNodeHealth(): Promise<Diagnostics> {
    try {
      const { SECONDS_PER_SLOT } = (await this.cacheManager.get(
        'specs',
      )) as BeaconNodeSpecResults;
      return this.utilsService.fetchFromCache(
        'nodeHealth',
        (SECONDS_PER_SLOT * 1000) / 2,
        async () => {
          const [beaconHealth, validatorHealth] = await Promise.all([
            this.utilsService.sendHttpRequest({
              url: `${this.beaconUrl}/lighthouse/ui/health`,
            }),
            this.utilsService.sendHttpRequest({
              url: `${this.validatorUrl}/lighthouse/ui/health`,
              config: {
                headers: {
                  Authorization: `Bearer ${this.apiToken}`,
                },
              },
            }),
          ]);

          const { app_uptime: vcUptime } = validatorHealth.data.data;

          const {
            disk_bytes_free,
            disk_bytes_total,
            used_memory,
            total_memory,
            sys_loadavg_5,
            app_uptime: bnUptime,
            network_name,
            nat_open,
            global_cpu_frequency,
          } = beaconHealth.data.data;

          const diskUtilization = Math.round(
            getPercentage(disk_bytes_total - disk_bytes_free, disk_bytes_total),
          );

          const totalDiskSpace = formatGigBytes(disk_bytes_total);
          const totalDiskFree = formatGigBytes(disk_bytes_free);

          const diskStatus = {
            synced:
              totalDiskFree > 300
                ? StatusColor.SUCCESS
                : totalDiskFree >= 200 && totalDiskFree < 300
                  ? StatusColor.WARNING
                  : StatusColor.ERROR,
            syncing:
              totalDiskFree > 100
                ? StatusColor.SUCCESS
                : totalDiskFree >= 50 && totalDiskFree < 100
                  ? StatusColor.WARNING
                  : StatusColor.ERROR,
          };

          const memoryUtilization = Math.round(
            getPercentage(used_memory, total_memory),
          );
          const totalMemory = formatGigBytes(total_memory);
          const usedMemory = formatGigBytes(used_memory);

          const totalMemoryFree = totalMemory - usedMemory;

          const ramStatus =
            totalMemoryFree >= 3
              ? StatusColor.SUCCESS
              : totalMemoryFree > 1 && totalMemoryFree < 3
                ? StatusColor.WARNING
                : StatusColor.ERROR;

          const cpuUtilization = sys_loadavg_5.toFixed(1);

          const cpuStatus =
            sys_loadavg_5 <= 80
              ? StatusColor.SUCCESS
              : sys_loadavg_5 > 80 && sys_loadavg_5 < 90
                ? StatusColor.WARNING
                : StatusColor.ERROR;

          const overallSyncingHealth = [
            diskStatus.syncing,
            cpuStatus,
            ramStatus,
          ];
          const overallSyncedHealth = [diskStatus.synced, cpuStatus, ramStatus];

          const overallHealthStatus = {
            syncing: this.utilsService.getHealthStatus(overallSyncingHealth),
            synced: this.utilsService.getHealthStatus(overallSyncedHealth),
          };
          const healthCondition = {
            syncing: this.utilsService.getHealthCondition(
              overallHealthStatus.syncing,
            ),
            synced: this.utilsService.getHealthCondition(
              overallHealthStatus.synced,
            ),
          };

          return {
            totalDiskSpace,
            diskUtilization,
            totalDiskFree,
            diskStatus,
            totalMemory,
            memoryUtilization,
            frequency: String(global_cpu_frequency),
            ramStatus,
            cpuStatus,
            cpuUtilization,
            networkName: network_name,
            natOpen: nat_open,
            uptime: {
              beacon: secondsToShortHand(bnUptime || 0),
              validator: secondsToShortHand(vcUptime || 0),
            },
            healthCondition,
            overallHealthStatus,
          };
        },
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch beacon health data');
    }
  }
}
