import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { throwServerError } from '../utilities';
import { UtilsService } from '../utils/utils.service';
import {
  BeaconValidatorResult,
  PartialWithdrawal,
  PendingDeposit,
  ValidatorCache,
  ValidatorDetail,
  ValidatorInfo,
} from '../../../src/types/validator';
import formatDefaultValName from '../../../utilities/formatDefaultValName';
import { formatUnits } from 'ethers';
import { Metric } from './entities/metric.entity';
import { ValidatorAlias } from './entities/validator-alias.entity';
import getAverageKeyValue from '../../../utilities/getAverageKeyValue';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ValidatorMetricResult } from '../../../src/types/beacon';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../../../src/types';
import { Status } from '../../../src/constants/enums';

@Injectable()
export class ValidatorService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(ValidatorAlias)
    private validatorAliasRepository: typeof ValidatorAlias,
    private utilsService: UtilsService,
    private activityService: ActivityService,
  ) { }
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private beaconUrl = process.env.BEACON_URL;

  private config = {
    headers: {
      Authorization: `Bearer ${this.apiToken}`,
    },
  };

  async fetchValidatorAuthKey(): Promise<{ token_path: string }> {
    try {
      const data = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/auth`,
      });
      return data.data;
    } catch (e) {
      throwServerError('Unable to fetch validator auth key');
    }
  }

  async fetchValidatorVersion(): Promise<{ version: string }> {
    try {
      const { data } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/version`,
        config: this.config,
      });
      return data.data;
    } catch (e) {
      throwServerError('Unable to fetch validator version');
    }
  }

  async fetchValidatorStates(): Promise<ValidatorInfo[]> {
    try {
      return this.utilsService.fetchFromCache(
        'valStates',
        await this.utilsService.getSlotInterval(),
        async () => {
          const validatorData = (await this.cacheManager.get(
            'validators',
          )) as ValidatorDetail[];
          // Batch validator state requests to avoid response size limits
          const BATCH_SIZE = 500;
          const allStates = [];

          for (let i = 0; i < validatorData.length; i += BATCH_SIZE) {
            const batch = validatorData.slice(i, i + BATCH_SIZE);
            const pubkeys = batch.map(({ pubkey }) => pubkey).join(',');
            const { data: states } = await this.utilsService.sendHttpRequest({
              url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${pubkeys}`,
            });
            allStates.push(...states.data);
          }

          const sortedStates = [...allStates].sort(
            (a: BeaconValidatorResult, b: BeaconValidatorResult) =>
              Number(a.index) - Number(b.index),
          ) as BeaconValidatorResult[];

          return sortedStates.map(({ validator, index, status, balance }) => {
            const {
              pubkey,
              effective_balance,
              slashed,
              withdrawal_credentials,
              activation_epoch,
            } = validator;
            let effectiveBalance = Number(
              formatUnits(effective_balance, 'gwei'),
            );

            if (status === 'withdrawal_done') {
              effectiveBalance = 0;
            }

            return {
              name: formatDefaultValName(index),
              pubKey: pubkey,
              effectiveBalance,
              balance: Number(formatUnits(balance, 'gwei')),
              rewards: Number(formatUnits(balance, 'gwei')) - effectiveBalance,
              index: Number(index),
              slashed,
              withdrawalAddress: withdrawal_credentials,
              activationEpoch: Number(activation_epoch),
              status: status,
              processed: 0,
              missed: 0,
              attested: 0,
              aggregated: 0,
            };
          });
        },
      );
    } catch (e) {
      throwServerError('Unable to fetch validator states');
    }
  }

  async fetchValidatorCaches(): Promise<ValidatorCache> {
    try {
      return this.utilsService.fetchFromCache(
        'valCache',
        await this.utilsService.getSlotInterval(),
        async () => {
          const validatorData = (await this.cacheManager.get(
            'validators',
          )) as ValidatorDetail[];
          const requestData = {
            data: JSON.stringify({
              indices: validatorData.map(({ index }) => index),
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          };

          const { data: caches } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/lighthouse/ui/validator_info`,
            method: 'POST',
            config: requestData,
          });

          return Object.fromEntries(
            Object.entries(
              caches.data.validators as Record<
                number,
                { info: { epoch: string; total_balance: string } }
              >,
            ).map(([key, data]) => [Number(key), data.info]),
          );
        },
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator cache');
    }
  }

  async fetchMetrics(index?: number): Promise<ValidatorMetricResult> {
    try {
      const options = index ? { where: { index } } : undefined;
      const metrics = await this.utilsService.fetchAll(Metric, options);
      const metricsData = metrics.map((metric) => JSON.parse(metric.data));

      const targetEffectiveness = getAverageKeyValue(
        metricsData,
        'attestation_target_hit_percentage',
      );
      const hitEffectiveness = getAverageKeyValue(
        metricsData,
        'attestation_hit_percentage',
      );

      const totalEffectiveness = (targetEffectiveness + hitEffectiveness) / 2;

      return {
        targetEffectiveness,
        hitEffectiveness,
        totalEffectiveness,
      };
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator validator-metrics');
    }
  }

  async fetchGraffiti(index: string): Promise<{ data: string }> {
    try {
      const validatorData = (await this.cacheManager.get(
        'validators',
      )) as ValidatorDetail[];

      const validator = validatorData.find(
        (validator) => validator.index === index,
      );
      const { data } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/ui/graffiti`,
        config: this.config,
      });

      return {
        data: data.data[validator.pubkey],
      };
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator graffiti');
    }
  }

  async updateGraffiti(data: any) {
    try {
      const { status } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/validators/${data.pubKey}`,
        method: 'PATCH',
        config: {
          data: JSON.stringify({ graffiti: data.graffiti }),
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers,
          },
        },
      });

      if (status === 200) {
        await this.activityService.storeActivity(
          '',
          data.pubKey,
          ActivityType.GRAFFITI,
          Status.SUCCESS,
        );
      }

      return status;
    } catch (e) {
      console.error(e);
      await this.activityService.storeActivity(
        '',
        data.pubKey,
        ActivityType.GRAFFITI,
        Status.ERROR,
      );
      throwServerError('Unable to update validator graffiti');
    }
  }

  async signVoluntaryExit(pubKey: string) {
    try {
      const { data } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/eth/v1/validator/${pubKey}/voluntary_exit`,
        method: 'POST',
        config: this.config,
      });

      if (data) {
        return data?.data || data;
      }
    } catch (e) {
      console.error(e);
      throwServerError('Unable to sign voluntary exit');
    }
  }

  async importValidatorKeystore(data: any) {
    const requestData = {
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    };

    try {
      const { data } = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/validators/keystore`,
        method: 'POST',
        config: requestData,
      });

      if (data) {
        await this.activityService.storeActivity(
          '',
          data.data.voting_pubkey,
          ActivityType.IMPORT,
          Status.SUCCESS,
        );
        return data;
      }
    } catch (e) {
      await this.activityService.storeActivity(
        JSON.stringify({ status: Status.ERROR }),
        'fake',
        ActivityType.IMPORT,
        Status.ERROR,
      );
      throwServerError('Unable to import validator keystore');
    }
  }

  async fetchPartialWithdrawals(): Promise<PartialWithdrawal[]> {
    const withdrawals =
      await this.cacheManager.get<PartialWithdrawal[]>('partialWithdrawals');
    return withdrawals ?? [];
  }

  async fetchPendingDeposits(): Promise<PendingDeposit[]> {
    const deposits =
      await this.cacheManager.get<PendingDeposit[]>('pendingDeposits');
    return deposits ?? [];
  }

  async fetchValidatorAliases(): Promise<Record<string, string>> {
    try {
      const aliases = await this.validatorAliasRepository.findAll();
      return Object.fromEntries(
        aliases.map((alias) => [alias.validatorIndex.toString(), alias.alias]),
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator aliases');
    }
  }

  async createOrUpdateValidatorAlias(
    validatorIndex: number,
    alias: string,
  ): Promise<ValidatorAlias> {
    try {
      const existingAlias = await this.validatorAliasRepository.findOne({
        where: { validatorIndex },
      });

      if (existingAlias) {
        existingAlias.alias = alias;
        return await existingAlias.save();
      } else {
        return await this.validatorAliasRepository.create({
          validatorIndex,
          alias,
        });
      }
    } catch (e) {
      console.error(e);
      throwServerError('Unable to save validator alias');
    }
  }

  async deleteValidatorAlias(validatorIndex: number): Promise<void> {
    try {
      await this.validatorAliasRepository.destroy({
        where: { validatorIndex },
      });
    } catch (e) {
      console.error(e);
      throwServerError('Unable to delete validator alias');
    }
  }

  async importValidatorAliases(aliases: Record<string, string>): Promise<void> {
    try {
      for (const [indexStr, alias] of Object.entries(aliases)) {
        const validatorIndex = parseInt(indexStr, 10);
        if (!isNaN(validatorIndex) && alias.trim()) {
          await this.createOrUpdateValidatorAlias(validatorIndex, alias.trim());
        }
      }
    } catch (e) {
      console.error(e);
      throwServerError('Unable to import validator aliases');
    }
  }
}
