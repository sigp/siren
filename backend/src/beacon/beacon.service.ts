import { Inject, Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { throwServerError } from '../utilities';
import getPercentage from '../../../utilities/getPercentage';
import getStatus from '../../../utilities/getInclusionRateStatus';
import { ProposerDuty } from '../../../src/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BeaconNodeSpecResults, SyncData } from '../../../src/types/beacon';
import {
  ValidatorCountResult,
  ValidatorDetail,
  ValidatorInclusionData,
} from '../../../src/types/validator';
import { PeerDataResults } from '../../../src/types/diagnostic';

@Injectable()
export class BeaconService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private utilsService: UtilsService,
  ) {}
  private beaconUrl = process.env.BEACON_URL;
  private isDebug = process.env.DEBUG === 'true';

  async fetchBeaconNodeVersion(useCache: boolean = true): Promise<string> {
    try {
      if (useCache) {
        return await this.utilsService.fetchFromCache(
          'bnVersion',
          0, // Changed from 60000 to 0 (infinite) - version doesn't change during session
          async () => {
            return await this._fetchBeaconNodeVersion();
          },
        );
      }
      return await this._fetchBeaconNodeVersion();
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch beacon node version');
    }
  }

  private async _fetchBeaconNodeVersion(): Promise<string> {
    const { data } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/node/version`,
    });
    return data.data;
  }

  async fetchGenesisData(): Promise<number> {
    try {
      return await this.utilsService.fetchFromCache('genesis', 0, async () => {
        const { data } = await this.utilsService.sendHttpRequest({
          url: `${this.beaconUrl}/eth/v1/beacon/genesis`,
        });

        return Number(data.data.genesis_time);
      });
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch beacon node version');
    }
  }

  async fetchSpecData(): Promise<BeaconNodeSpecResults> {
    return await this.cacheManager.get('specs');
  }

  async fetchSyncData(): Promise<SyncData> {
    try {
      const { SLOTS_PER_EPOCH } = (await this.cacheManager.get(
        'specs',
      )) as BeaconNodeSpecResults;

      const slotInterval = await this.utilsService.getSlotInterval();
      return await this.utilsService.fetchFromCache(
        'syncData',
        slotInterval,
        async () => {
          const beaconResponse = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/eth/v1/node/syncing`,
          });

          const { head_slot, sync_distance, is_syncing } =
            beaconResponse.data.data;

          const headSlot = Number(head_slot);
          const currentEpoch = Math.floor(headSlot / Number(SLOTS_PER_EPOCH));

          const distance = headSlot + Number(sync_distance);

          return {
            beaconSync: {
              headSlot: headSlot,
              currentEpoch,
              slotDistance: distance,
              beaconPercentage: getPercentage(head_slot, distance),
              beaconSyncTime: Number(sync_distance) * (slotInterval / 1000),
              syncDistance: Number(sync_distance),
              isSyncing: is_syncing,
            },
          };
        },
      );
    } catch (e) {
      console.error(e);
      throw new Error('Unable to fetch sync data');
    }
  }

  async fetchCachedHeadSlot(api): Promise<number> {
    let syncData = (await this.cacheManager.get('syncData')) as any;

    if (!syncData) {
      const beaconResponse = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/eth/v1/node/syncing`,
      });

      if (this.isDebug) {
        console.log(`fetching 2nd syncData from node for ${api}.....`);
      }

      syncData = {
        beaconSync: {
          headSlot: beaconResponse.data.data.head_slot,
        },
      };
    } else {
      if (this.isDebug) {
        console.log(`fetching cached syncData for ${api}.....`);
      }
    }

    return syncData.beaconSync.headSlot;
  }

  async fetchInclusionRate(): Promise<ValidatorInclusionData> {
    try {
      const { SLOTS_PER_EPOCH } = (await this.cacheManager.get(
        'specs',
      )) as BeaconNodeSpecResults;

      return await this.utilsService.fetchFromCache(
        'inclusionRate',
        await this.utilsService.getSlotInterval(),
        async () => {
          const headSlot = await this.fetchCachedHeadSlot('inclusionRate');

          const epoch =
            Math.floor(Number(headSlot) / Number(SLOTS_PER_EPOCH)) - 1;

          const { data } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/lighthouse/validator_inclusion/${epoch}/global`,
          });

          const {
            previous_epoch_target_attesting_gwei,
            current_epoch_active_gwei,
          } = data.data;

          const rate =
            (previous_epoch_target_attesting_gwei / current_epoch_active_gwei) *
            100;
          const truncatedRate = Math.trunc(rate * 100) / 100;

          const status = getStatus(truncatedRate);

          return {
            rate: truncatedRate,
            status,
          };
        },
      );
    } catch (e) {
      console.error(e);
      throw new Error('Unable to fetch inclusion data');
    }
  }

  async fetchPeerData(): Promise<PeerDataResults> {
    try {
      return this.utilsService.fetchFromCache(
        'peerData',
        await this.utilsService.getSlotInterval(),
        async () => {
          const { data } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/eth/v1/node/peer_count`,
          });
          return { connected: Number(data.data.connected) };
        },
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch peer data');
    }
  }

  async fetchValidatorCount(): Promise<ValidatorCountResult> {
    try {
      return this.utilsService.fetchFromCache(
        'validatorCount',
        60000,
        async () => {
          const { data } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/lighthouse/ui/validator_count`,
          });
          return data.data;
        },
      );
    } catch (e) {
      console.error(e);
      throwServerError('Unable to fetch validator count data');
    }
  }

  async fetchProposerDuties(): Promise<ProposerDuty[]> {
    try {
      const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT } =
        (await this.cacheManager.get('specs')) as BeaconNodeSpecResults;
      const halfEpochInterval =
        ((Number(SECONDS_PER_SLOT) * Number(SLOTS_PER_EPOCH)) / 2) * 1000;

      return await this.utilsService.fetchFromCache(
        'proposerDuties',
        halfEpochInterval,
        async () => {
          const states = (await this.cacheManager.get(
            'validators',
          )) as ValidatorDetail[];

          const activeValidators = states
            .filter(
              ({ status }) =>
                status.includes('active') &&
                !status.includes('slashed') &&
                !status.includes('exiting') &&
                !status.includes('exited'),
            )
            .map(({ index }) => index);

          const headSlot = await this.fetchCachedHeadSlot('proposerDuties');
          const closestEpoch =
            Math.floor(Number(headSlot) / Number(SLOTS_PER_EPOCH)) + 1;

          const { data } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/eth/v1/validator/duties/proposer/${closestEpoch}`,
          });

          return data.data
            .map((duty) => ({
              ...duty,
              uuid: `${duty.slot}${duty.validator_index}`,
            }))
            .filter((duty: ProposerDuty) =>
              activeValidators.includes(duty.validator_index),
            );
        },
      );
    } catch (e) {
      console.error(e?.response?.data);
      return [];
    }
  }

  async executeBlsChange(reqData: any): Promise<number> {
    const { status } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/pool/bls_to_execution_changes`,
      method: 'POST',
      config: {
        data: JSON.parse(reqData.data),
        headers: { 'Content-Type': 'application/json' },
      },
    });
    return status;
  }

  async submitSignedExit(message: any): Promise<number> {
    try {
      const { status } = await this.utilsService.sendHttpRequest({
        url: `${this.beaconUrl}/eth/v1/beacon/pool/voluntary_exits`,
        method: 'POST',
        config: {
          data: message,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      });

      return status;
    } catch (e) {
      console.error(e);
      throwServerError('Unable to sign voluntary exit');
    }
  }

  async fetchValidatorStatus(pubKey: string) {
    const { data: states } = await this.utilsService.sendHttpRequest({
      url: `${this.beaconUrl}/eth/v1/beacon/states/head/validators?id=${pubKey}`,
    });

    const valData = states.data;

    if (valData.length > 0) {
      return { data: valData[0] };
    }

    return { data: null };
  }

  async fetchForkVersion() {
    try {
      const slotInterval = await this.utilsService.getSlotInterval();
      return this.utilsService.fetchFromCache(
        'fork-version',
        slotInterval * 16,
        async () => {
          const { data } = await this.utilsService.sendHttpRequest({
            url: `${this.beaconUrl}/eth/v1/beacon/states/head/fork`,
          });

          return data;
        },
      );
    } catch (e) {
      console.log(e);
      throwServerError('Unable to fetch fork version data');
    }
  }
}
