import { useRecoilValue } from 'recoil'
import { selectValidatorInfos } from '../recoil/selectors/selectValidatorInfos'
import { useMemo } from 'react'
import { fetchValidatorStatuses } from '../api/beacon'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { BeaconValidatorResult } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { initialEthDeposit } from '../constants/constants'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'

const useValidatorEarnings = () => {
  const validators = useRecoilValue(selectValidatorInfos)
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const { headSlot } = useRecoilValue(selectBeaconSyncInfo)

  const validatorKeys = useMemo(() => {
    return validators.map((validator) => validator.pubKey).join(',')
  }, [validators])

  const total = useMemo(() => {
    return validators.map((validator) => validator.rewards).reduce((a, b) => a + b, 0)
  }, [validators])

  const fetchHistory = async (distance: number) => {
    if (distance > headSlot) {
      return total
    }

    if (!baseBeaconUrl) return

    const { data } = await fetchValidatorStatuses(
      baseBeaconUrl,
      validatorKeys,
      (headSlot - distance).toString(),
    )

    const previousEarning = data.data
      .map(
        (info: BeaconValidatorResult) =>
          Number(formatUnits(info.balance, 'gwei')) - initialEthDeposit,
      )
      .reduce((a: number, b: number) => a + b, 0)

    return total - previousEarning
  }

  return {
    total,
    fetchHistory,
  }
}

export default useValidatorEarnings
