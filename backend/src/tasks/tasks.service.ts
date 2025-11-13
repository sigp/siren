import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';
import {
  LighthouseValidatorResult,
  ValidatorDetail,
} from '../../../src/types/validator';
import { Metric } from '../validator/entities/metric.entity';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LogsService } from '../logs/logs.service';
import { LogType } from '../../../src/types';
import { Log } from '../logs/entities/log.entity';
import { Network } from '../../../src/constants/enums';
import {
  HOODI_PECTRA_FORK_VERSION,
  MAINNET_PECTRA_FORK_VERSION,
  SEPOLIA_PECTRA_FORK_VERSION,
  BACKEND_RETRY_DELAY,
} from '../../../src/constants/constants';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectModel(Metric)
    private metricRepository: typeof Metric,
    @InjectModel(Log)
    private logRepository: typeof Log,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
    private logsService: LogsService,
  ) {}

  private beaconUrl = process.env.BEACON_URL;
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private sessionPassword = process.env.SESSION_PASSWORD;
  private isDebug = process.env.DEBUG === 'true';

  async onApplicationBootstrap(): Promise<void> {
    console.log('Application Bootstrapping....');

    // Check required configuration first (these should fail immediately)
    if (!this.sessionPassword) {
      console.error('No session password found...');
      console.error(this.utilsService.getErrorMessage('NO_SESSION_PASSWORD'));
      process.exit(1);
    }

    if (!this.apiToken) {
      console.error('No api token found...');
      console.error(this.utilsService.getErrorMessage('NO_API_TOKEN'));
      process.exit(1);
    }

    // Start the connection retry loop
    this.initConnectionRetryLoop();
  }

  private async initConnectionRetryLoop(): Promise<void> {
    while (true) {
      try {
        console.log(
          'Attempting to connect to beacon node and validator client...',
        );

        await this.syncBeaconSpecs();
        await this.initValidatorDataScheduler();
        await this.initMetricDataScheduler();
        await this.initPendingDepositsScheduler();
        await this.initPendingPartialWithdrawalsScheduler();

        try {
          await this.logsService.startSse(
            `${this.validatorUrl}/lighthouse/logs`,
            LogType.VALIDATOR,
          );
        } catch (e) {
          console.error(
            'Failed to start validator SSE, will retry on next connection attempt:',
            e?.message || e,
          );
        }

        try {
          await this.logsService.startSse(
            `${this.beaconUrl}/lighthouse/logs`,
            LogType.BEACON,
          );
        } catch (e) {
          console.error(
            'Failed to start beacon SSE, will retry on next connection attempt:',
            e?.message || e,
          );
        }

        await this.initMetricsCleaningScheduler();
        this.initLogCleaningScheduler();

        console.log(
          'Successfully connected to beacon node and validator client',
        );
        break;
      } catch (e) {
        const errorCode = e?.response?.data?.code || e?.code || 'UNKNOWN';
        const errorMessage = this.utilsService.getErrorMessage(errorCode);

        console.error(`Connection failed [${errorCode}]: ${errorMessage}`);

        if (errorCode === 'ECONNREFUSED') {
          console.error(
            'Unable to reach beacon node or validator client endpoints',
          );
          console.error(
            'Please ensure the services are running and accessible',
          );
        }

        if (this.isDebug) {
          console.error('Detailed error:', e);
        }

        try {
          this.clearAllSchedulers();
          this.logsService.closeAllSseConnections();
        } catch (clearError) {
          console.error(
            'Error clearing schedulers and connections:',
            clearError,
          );
        }

        console.log(
          `Retrying connection in ${BACKEND_RETRY_DELAY / 1000} seconds...`,
        );
        await this.wait(BACKEND_RETRY_DELAY);
      }
    }
  }

  private clearAllSchedulers(): void {
    // Clear all existing intervals to prevent conflicts during retry
    const intervals = [
      'metricTask',
      'pendingDepositsTask',
      'pendingPartialWithdrawalTask',
      'validatorTask',
      'clean-metrics',
      'clean-logs',
    ];

    intervals.forEach((intervalName) => {
      try {
        if (this.schedulerRegistry.doesExist('interval', intervalName)) {
          this.schedulerRegistry.deleteInterval(intervalName);
          console.log(`Cleared existing interval: ${intervalName}`);
        }
      } catch (e) {
        // Ignore errors when clearing non-existent intervals
      }
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private initLogCleaningScheduler() {
    this.setDynamicInterval('clean-logs', 60000, async () => {
      if (this.isDebug) {
        console.log('cleaning logs database....');
      }
      const thresholdDate = moment().subtract(24, 'hours').toDate();

      await this.logRepository.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdDate,
          },
        },
      });
    });
  }

  private async initMetricsCleaningScheduler() {
    const interval = await this.utilsService.getEpochInterval(1);
    this.setDynamicInterval('clean-metrics', interval / 2, async () => {
      if (this.isDebug) {
        console.log('cleaning metric database....');
      }

      const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT } =
        (await this.cacheManager.get('specs')) as BeaconNodeSpecResults;
      const secondsPerEpoch =
        Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT);
      const thresholdDate = moment()
        .subtract(secondsPerEpoch * 10, 'seconds')
        .toDate();

      await this.metricRepository.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdDate,
          },
        },
      });
    });
  }

  private async initMetricDataScheduler() {
    const interval = await this.utilsService.getEpochInterval(1);
    await this.syncMetricData();

    this.setDynamicInterval('metricTask', interval, async () => {
      await this.syncMetricData();
    });
  }

  private async getPectraForkVersion() {
    const { CONFIG_NAME } = (await this.cacheManager.get(
      'specs',
    )) as BeaconNodeSpecResults;

    const config = CONFIG_NAME.toLowerCase();

    return config === Network.Mainnet.toLowerCase()
      ? MAINNET_PECTRA_FORK_VERSION
      : config === Network.Hoodi.toLowerCase()
        ? HOODI_PECTRA_FORK_VERSION
        : config === Network.Sepolia.toLowerCase()
          ? SEPOLIA_PECTRA_FORK_VERSION
          : process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION;
  }

  private async initPendingDepositsScheduler() {
    const pectraForkVersion = await this.getPectraForkVersion();

    if (!pectraForkVersion) return;

    const interval = await this.utilsService.getSlotInterval();

    await this.syncPendingDeposits(pectraForkVersion);

    this.setDynamicInterval('pendingDepositsTask', interval, async () => {
      await this.syncPendingDeposits(pectraForkVersion);
    });
  }

  private async syncPendingDeposits(version: string) {
    const validatorData = (await this.cacheManager.get(
      'validators',
    )) as ValidatorDetail[];

    // Skip if no validators
    if (!validatorData || validatorData.length === 0) {
      if (this.isDebug) {
        console.log('Skipping pending deposits sync - no validators');
      }
      await this.cacheManager.set('pendingDeposits', [], 0);
      return;
    }

    const { data: fork } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/fork`,
    });

    if (fork.data.current_version !== version) {
      if (this.isDebug) {
        console.log('Awaiting Pectra fork...');
      }

      return;
    }

    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/pending_deposits`,
      method: 'GET',
    });

    const pubKeys = validatorData.map((validator) => validator.pubkey);
    const pubKeySet = new Set(pubKeys);

    const matchingDeposits = data.data.filter((deposit) =>
      pubKeySet.has(deposit.pubkey),
    );

    await this.cacheManager.set('pendingDeposits', matchingDeposits, 0);
  }

  private async initPendingPartialWithdrawalsScheduler() {
    const pectraForkVersion = await this.getPectraForkVersion();

    if (!pectraForkVersion) return;

    const interval = await this.utilsService.getSlotInterval();

    await this.syncPendingPartialWithdrawals(pectraForkVersion);

    this.setDynamicInterval(
      'pendingPartialWithdrawalTask',
      interval,
      async () => {
        await this.syncPendingPartialWithdrawals(pectraForkVersion);
      },
    );
  }

  private async syncPendingPartialWithdrawals(version: string) {
    const validatorData = (await this.cacheManager.get(
      'validators',
    )) as ValidatorDetail[];

    // Skip if no validators
    if (!validatorData || validatorData.length === 0) {
      if (this.isDebug) {
        console.log(
          'Skipping pending partial withdrawals sync - no validators',
        );
      }
      await this.cacheManager.set('partialWithdrawals', [], 0);
      return;
    }

    const { data: fork } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/fork`,
    });

    if (fork.data.current_version !== version) {
      if (this.isDebug) {
        console.log('Awaiting Pectra fork...');
      }

      return;
    }

    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/pending_partial_withdrawals`,
      method: 'GET',
    });

    const indices = validatorData.map((validator) => validator.index);
    const withdrawals = data.data.filter((item) =>
      indices.includes(item.validator_index),
    );

    await this.cacheManager.set('partialWithdrawals', withdrawals, 0);
  }

  private async syncMetricData() {
    const validatorData = (await this.cacheManager.get(
      'validators',
    )) as ValidatorDetail[];

    // Skip if no validators
    if (!validatorData || validatorData.length === 0) {
      if (this.isDebug) {
        console.log('Skipping metric sync - no validators');
      }
      return;
    }

    const requestData = {
      data: JSON.stringify({
        indices: validatorData.map(({ index }) => Number(index)),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data: metrics } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/lighthouse/ui/validator_metrics`,
      method: 'POST',
      config: requestData,
    });

    const metricData = metrics.data.validators;
    const indices = Object.keys(metricData);

    await this.metricRepository.bulkCreate(
      indices.map((index) => ({
        index,
        data: JSON.stringify(metricData[index]),
      })),
    );
  }

  private async syncBeaconSpecs() {
    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/config/spec`,
    });
    await this.cacheManager.set('specs', data.data, 0);
  }

  private async syncValidatorData() {
    if (this.isDebug) {
      console.log('Syncing validator data...');
    }

    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.validatorUrl}/lighthouse/validators`,
      config: {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      },
    });

    // If there are no validators, set empty array and skip beacon API request
    if (!data.data || data.data.length === 0) {
      if (this.isDebug) {
        console.log('No validators found in validator client');
      }
      await this.cacheManager.set('validators', [], 0);
      return;
    }

    const validatorKeys = data.data
      .map((validator: LighthouseValidatorResult) => validator.voting_pubkey)
      .join(',');

    const { data: states } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorKeys}`,
    });

    const validators = states.data.map(
      ({ index, status, validator: { pubkey, withdrawal_credentials } }) => ({
        index,
        pubkey,
        withdrawal_credentials,
        status,
      }),
    );

    await this.cacheManager.set('validators', validators, 0);
  }

  private async initValidatorDataScheduler() {
    const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT } = (await this.cacheManager.get(
      'specs',
    )) as BeaconNodeSpecResults;
    const secondsPerEpoch = Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT);

    await this.syncValidatorData();

    this.setDynamicInterval(
      'validatorTask',
      secondsPerEpoch * 1000,
      async () => {
        await this.syncValidatorData();
      },
    );
  }

  private setDynamicInterval(
    name: string,
    milliseconds: number,
    callback: () => void,
  ) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
    console.log(
      `Interval ${name} set to run every ${milliseconds / 1000} seconds`,
    );
  }
}
