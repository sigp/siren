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
import { getCachedNetworkProfile } from '../utils/network-profile.helper';

@Injectable()
export class NodeService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private utilsService: UtilsService,
  ) {}
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private beaconUrl = process.env.BEACON_URL;
  private disableHealthChecks = process.env.DISABLE_HEALTH_CHECKS === 'true';

  async fetchNodeHealth(): Promise<Diagnostics> {
    try {
      const { SECONDS_PER_SLOT } = (await this.cacheManager.get(
        'specs',
      )) as BeaconNodeSpecResults;
      const profile = await getCachedNetworkProfile(this.cacheManager);
      const useStrictThresholds =
        profile.key === 'mainnet' || profile.key === 'gnosis';

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
            sys_loadavg_1,
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

          const diskThresholds = useStrictThresholds
            ? {
                synced: { success: 300, warning: 200 },
                syncing: { success: 100, warning: 50 },
              }
            : {
                synced: { success: 50, warning: 25 },
                syncing: { success: 50, warning: 25 },
              };

          const diskStatus = {
            synced: this.disableHealthChecks
              ? StatusColor.SUCCESS
              : totalDiskFree > diskThresholds.synced.success
                ? StatusColor.SUCCESS
                : totalDiskFree >= diskThresholds.synced.warning &&
                    totalDiskFree < diskThresholds.synced.success
                  ? StatusColor.WARNING
                  : StatusColor.ERROR,
            syncing: this.disableHealthChecks
              ? StatusColor.SUCCESS
              : totalDiskFree > diskThresholds.syncing.success
                ? StatusColor.SUCCESS
                : totalDiskFree >= diskThresholds.syncing.warning &&
                    totalDiskFree < diskThresholds.syncing.success
                  ? StatusColor.WARNING
                  : StatusColor.ERROR,
          };

          const memoryUtilization = Math.round(
            getPercentage(used_memory, total_memory),
          );
          const totalMemory = formatGigBytes(total_memory);
          const usedMemory = formatGigBytes(used_memory);

          const totalMemoryFree = totalMemory - usedMemory;

          const ramThresholds = useStrictThresholds
            ? { success: 3, warning: 1 }
            : { success: 1.5, warning: 0.5 };

          const ramStatus = this.disableHealthChecks
            ? StatusColor.SUCCESS
            : totalMemoryFree >= ramThresholds.success
              ? StatusColor.SUCCESS
              : totalMemoryFree > ramThresholds.warning &&
                  totalMemoryFree < ramThresholds.success
                ? StatusColor.WARNING
                : StatusColor.ERROR;

          const cpuUtilization = sys_loadavg_1.toFixed(1);

          const cpuThresholds = useStrictThresholds
            ? { success: 80, warning: 90 }
            : { success: 80, warning: 90 };

          const cpuStatus = this.disableHealthChecks
            ? StatusColor.SUCCESS
            : sys_loadavg_1 <= cpuThresholds.success
              ? StatusColor.SUCCESS
              : sys_loadavg_1 > cpuThresholds.success &&
                  sys_loadavg_1 < cpuThresholds.warning
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
