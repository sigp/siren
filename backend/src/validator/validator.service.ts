import { Inject, Injectable } from '@nestjs/common';
import { throwServerError } from '../utilities';
import { UtilsService } from '../utils/utils.service';
import {
  BeaconValidatorResult, ValidatorCache, ValidatorDetail, ValidatorInfo
} from '../../../src/types/validator';
import formatDefaultValName from '../../../utilities/formatDefaultValName';
import { formatUnits } from 'ethers';
import { Metric } from './entities/metric.entity';
import getAverageKeyValue from '../../../utilities/getAverageKeyValue';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ValidatorMetricResult } from '../../../src/types/beacon';

@Injectable()
export class ValidatorService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private utilsService: UtilsService
  ) {}
  private validatorUrl = process.env.VALIDATOR_URL;
  private apiToken = process.env.API_TOKEN;
  private beaconUrl = process.env.BEACON_URL;

  private config = {
    headers: {
      Authorization: `Bearer ${this.apiToken}`,
    },
  };

  async fetchValidatorAuthKey(): Promise<{token_path: string}> {
    try {
      const data = await this.utilsService.sendHttpRequest({
        url: `${this.validatorUrl}/lighthouse/auth`,
      });
      return data.data;
    } catch (e) {
      throwServerError('Unable to fetch validator auth key');
    }
  }

  async fetchValidatorVersion(): Promise<{version: string}> {
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
      return this.utilsService.fetchFromCache('valStates', await this.utilsService.getSlotInterval(), async () => {
        const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]
        const { data: states } = await this.utilsService.sendHttpRequest({
          url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${validatorData.map(({pubkey}) => pubkey)}`,
        });

        const sortedStates = [...states.data].sort(
          (a: BeaconValidatorResult, b: BeaconValidatorResult) =>
            Number(a.index) - Number(b.index),
        );

        return sortedStates.map(
          ({ validator, index, status, balance }: BeaconValidatorResult) => {
            let initialBalance = 32;

            if(status === 'withdrawal_done') {
              initialBalance = 0
            }

            return {
              name: formatDefaultValName(index),
              pubKey: validator.pubkey,
              balance: Number(formatUnits(balance, 'gwei')),
              rewards: Number(formatUnits(balance, 'gwei')) - initialBalance,
              index: Number(index),
              slashed: validator.slashed,
              withdrawalAddress: validator.withdrawal_credentials,
              status: status,
              processed: 0,
              missed: 0,
              attested: 0,
              aggregated: 0,
            };
          },
        );
      })
    } catch (e) {
      throwServerError('Unable to fetch validator states');
    }
  }

  async fetchValidatorCaches(): Promise<ValidatorCache> {
    try {
      return this.utilsService.fetchFromCache('valCache', await this.utilsService.getSlotInterval(), async () => {
        const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]
        const requestData = {
          data: JSON.stringify({
            indices: validatorData.map(({index}) => index),
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
      })
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator cache');
    }
  }

  async fetchMetrics(index?: number): Promise<ValidatorMetricResult> {
    try {
      const options = index ? {where: {index}} : undefined
      const metrics = await this.utilsService.fetchAll(Metric, options)
      const metricsData = metrics.map(metric => JSON.parse(metric.data))

      const targetEffectiveness = getAverageKeyValue(metricsData, 'attestation_target_hit_percentage')
      const hitEffectiveness = getAverageKeyValue(metricsData, 'attestation_hit_percentage')

      const totalEffectiveness = (targetEffectiveness + hitEffectiveness) / 2

      return {
        targetEffectiveness,
        hitEffectiveness,
        totalEffectiveness
      }
    }
     catch (e) {
      console.error(e)
      throwServerError('Unable to fetch validator validator-metrics')
    }
  }

  async fetchGraffiti(index: string): Promise<{data: string}> {
    try {
      const validatorData = await this.cacheManager.get('validators') as ValidatorDetail[]

      const validator = validatorData.find((validator) => validator.index === index)
      const {data} = await this.utilsService.sendHttpRequest({url: `${this.validatorUrl}/lighthouse/ui/graffiti`, config: this.config})

      return {
        data: data.data[validator.pubkey]
      }

    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator graffiti');
    }
  }

  async updateGraffiti(data: any) {
    try {
      const {status} = await this.utilsService.sendHttpRequest({url: `${this.validatorUrl}/lighthouse/validators/${data.pubKey}`, method: 'PATCH', config: {
        data: JSON.stringify({graffiti: data.graffiti}),
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        }
        }})
      return status
    } catch (e) {
      console.error(e)
      throwServerError('Unable to update validator graffiti')
    }
  }

  async signVoluntaryExit(pubKey: string) {
    try {
      const { data } = await this.utilsService.sendHttpRequest({url: `${this.validatorUrl}/eth/v1/validator/${pubKey}/voluntary_exit`, method: 'POST', config: this.config})

      if (data) {
        return data?.data || data
      }
    } catch (e) {
      console.error(e)
      throwServerError('Unable to sign voluntary exit')
    }
  }
}
