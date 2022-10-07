import { selector } from 'recoil';
import axios from 'axios';
import { selectValidatorUrl } from './selectValidatorUrl';
import { apiToken } from '../atoms';
import { BeaconValidatorResult, LighthouseValidatorResult, ValidatorInfo } from '../../types/validator';
import { selectBeaconUrl } from './selectBeaconUrl';
import { formatUnits } from 'ethers/lib/utils';

export const selectValidators = selector<ValidatorInfo[]>({
  key: 'ValidatorInfo',
  get: async ({ get }) => {
    const baseValidatorUrl = get(selectValidatorUrl)
    const baseBeaconUrl = get(selectBeaconUrl)
    const token = get(apiToken)

    const { data } = await axios.get(`${baseValidatorUrl}/validators`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const validatorKeys = data.data.map((item: LighthouseValidatorResult) => item.voting_pubkey);

    const beaconValidators = await axios.get(`${baseBeaconUrl}/v1/beacon/states/head/validators`, {
      params: {
        id: validatorKeys.join(',')
      }
    })

    const validatorInfo = beaconValidators.data.data.sort((a: BeaconValidatorResult, b: BeaconValidatorResult) => Number(b.index) - Number(a.index))

    return validatorInfo.map((info: BeaconValidatorResult) => ({
      pubKey: info.validator.pubkey,
      balance: Number(formatUnits(info.balance, 'gwei')).toFixed(4),
      rewards: Number(formatUnits(Number(info.balance) - Number(info.validator.effective_balance), 'gwei')).toFixed(4),
      index: Number(info.index),
      slashed: info.validator.slashed,
      status: info.status,
      processed: 0,
      missed: 0,
      attested: 0,
      aggregated: 0
    }));
  }
})