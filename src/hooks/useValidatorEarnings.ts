import { useRecoilValue } from 'recoil';
import { selectValidators } from '../recoil/selectors/selectValidators';
import { useMemo } from 'react';
import useBeaconSyncInfo from './useBeaconSyncInfo';
import { fetchValidators } from '../api/beacon';
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl';
import { BeaconValidatorResult } from '../types/validator';
import { formatUnits } from 'ethers/lib/utils';

const useValidatorEarnings = () => {
  const validators = useRecoilValue(selectValidators);
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl);
  const { headSlot } = useBeaconSyncInfo()

  const validatorKeys = useMemo(() => {
    return validators.map(validator => validator.pubKey).join(',')
  }, [validators]);

  const total = useMemo(() => {
    return validators.map(validator => validator.rewards).reduce((a,b) => a + b, 0);
  }, [validators]);

  const fetchHistory = async (distance: number) => {
    if(distance > headSlot) {
      return total;
    }

    if (!baseBeaconUrl) return;

    const {data} = await fetchValidators(baseBeaconUrl, validatorKeys, (headSlot - distance).toString());

    const previousEarning = data.data.map((info: BeaconValidatorResult) => Number(formatUnits(Number(info.balance) - Number(info.validator.effective_balance), 'gwei'))).reduce((a: number, b: number) => a + b, 0);

    return total - previousEarning;
  }

  return {
    total,
    fetchHistory
  }
}

export default useValidatorEarnings;