import { selector } from 'recoil';
import { selectBeaconSyncInfo } from './selectBeaconSyncInfo';
import { fetchValidatorStatuses } from '../../api/beacon';
import { selectBeaconUrl } from './selectBeaconUrl';
import { BeaconValidatorResult, ValidatorEpochData } from '../../types/validator';
import { formatUnits } from 'ethers/lib/utils';
import { selectValidators } from './selectValidators';

export const selectValidatorEpochs = selector<ValidatorEpochData[]>({
  key: 'ValidatorEpochs',
  get: async ({get}) => {
    const validators = get(selectValidators);
    const {head_slot} = get(selectBeaconSyncInfo);
    const baseBeaconUrl = get(selectBeaconUrl);

    if(!baseBeaconUrl) return [];

    const slotByEpoch = Array.from(Array(10).keys()).map(i => head_slot - (32 * i))

    const results = await Promise.all(slotByEpoch.map(epoch => {
      return epoch > 0 ? fetchValidatorStatuses(baseBeaconUrl, validators.map(validator => validator.pubKey).join(), epoch.toString()) : {data: []}
    }))

    const validatorsEpochs = results.map(data => data.data.data).filter(data => data !== undefined);

    return validators.map(({pubKey, name}) => ({
      name,
      data: validatorsEpochs.map(epoch => epoch.filter((data: BeaconValidatorResult) => data.validator.pubkey === pubKey).map((data: BeaconValidatorResult) => Number(formatUnits(data.balance, 'gwei')))).flat().reverse()
    }))
  },
})