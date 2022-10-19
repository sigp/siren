import { FC, ReactNode, useEffect } from 'react';
import { selectBeaconUrl } from '../../recoil/selectors/selectBeaconUrl';
import { selectValidators } from '../../recoil/selectors/selectValidators';
import { fetchValidatorStatuses } from '../../api/beacon';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import usePollingInterval from '../../hooks/usePollingInterval';
import { validatorStateInfo } from '../../recoil/atoms';
import { secondsInSlot } from '../../constants/constants';

export interface ValidatorInfoSyncProps {
  children?: ReactNode | ReactNode[]
}

const ValidatorInfoSync: FC<ValidatorInfoSyncProps> = ({children}) => {
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const validators = useRecoilValue(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)

  const fetchValidatorInfo = async () => {
    if (!baseBeaconUrl || !validators) return

    const beaconValidators = await fetchValidatorStatuses(
      baseBeaconUrl,
      validators.map((validator) => validator.pubKey).join(','),
    )

    setStateInfo(beaconValidators.data.data)
  }

  useEffect(() => {
    void fetchValidatorInfo()
  }, [])

  usePollingInterval(fetchValidatorInfo, (secondsInSlot) * 1000);

  return (
    <>
      {children}
    </>
  )
}

export default ValidatorInfoSync;