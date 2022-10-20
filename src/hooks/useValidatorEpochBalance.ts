import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { fetchValidatorStatuses } from '../api/beacon'
import { BeaconValidatorResult, ValidatorEpochData } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { secondsInSlot } from '../constants/constants'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import usePollingInterval from './usePollingInterval'

const useValidatorEpochBalance = () => {
  const validators = useRecoilValue(selectValidators)
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const { headSlot } = useRecoilValue(selectBeaconSyncInfo)

  const [epochs, setEpochs] = useState<ValidatorEpochData[]>([])

  const fetchEpochBalances = async () => {
    if (!baseBeaconUrl || !validators.length) return

    const slotByEpoch = Array.from(Array(10).keys()).map((i) => headSlot - 32 * i)

    const results = await Promise.all(
      slotByEpoch.map((epoch) => {
        return epoch > 0
          ? fetchValidatorStatuses(
              baseBeaconUrl,
              validators.map((validator) => validator.pubKey).join(),
              epoch.toString(),
            )
          : { data: [] }
      }),
    )

    const validatorsEpochs = results
      .map((data) => data.data.data)
      .filter((data) => data !== undefined)

    setEpochs(
      validators.map(({ pubKey, name }) => ({
        name,
        data: validatorsEpochs
          .map((epoch) =>
            epoch
              .filter((data: BeaconValidatorResult) => data.validator.pubkey === pubKey)
              .map((data: BeaconValidatorResult) => Number(formatUnits(data.balance, 'gwei'))),
          )
          .flat()
          .reverse(),
      })),
    )
  }

  usePollingInterval(fetchEpochBalances, secondsInSlot * 3 * 1000)

  useEffect(() => {
    if (!epochs.length && headSlot) {
      void fetchEpochBalances()
    }
  }, [headSlot, epochs])

  return {
    epochs,
  }
}

export default useValidatorEpochBalance
