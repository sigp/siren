import { useRecoilValue } from 'recoil'
import { useEffect, useMemo, useState } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { fetchValidatorStatuses } from '../api/beacon'
import { BeaconValidatorResult, ValidatorEpochData } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import { validatorIntervalIncrement, validatorStateInfo } from '../recoil/atoms'
import { slotsInEpoc } from '../constants/constants'
import { selectAtHeadSlot } from '../recoil/selectors/selectAtHeadSlot'

const useValidatorEpochBalance = () => {
  const validators = useRecoilValue(selectValidators)
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const validatorInfo = useRecoilValue(validatorStateInfo)
  const validatorIncrement = useRecoilValue(validatorIntervalIncrement)
  const { headSlot } = useRecoilValue(selectBeaconSyncInfo)
  const atHeadSlot = useRecoilValue(selectAtHeadSlot)

  const [epochs, setEpochs] = useState<BeaconValidatorResult[][]>([])

  useEffect(() => {
    if ((atHeadSlot || 0) < -5) {
      void fetchEpochBalances()
    }
  }, [atHeadSlot])

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

    setEpochs(validatorsEpochs)
  }

  const formattedEpochData = useMemo<ValidatorEpochData[]>(() => {
    return epochs.length
      ? validators.slice(0, 10).map(({ pubKey, name }) => ({
          name,
          data: epochs
            .map((epoch) =>
              epoch
                .filter((data: BeaconValidatorResult) => data.validator.pubkey === pubKey)
                .map((data: BeaconValidatorResult) => Number(formatUnits(data.balance, 'gwei'))),
            )
            .flat()
            .reverse(),
        }))
      : []
  }, [epochs, validators])

  useEffect(() => {
    if (validatorIncrement === slotsInEpoc) {
      setEpochs((prev) => [validatorInfo, ...prev.slice(1)])
    }
  }, [validatorIncrement, validatorInfo])

  useEffect(() => {
    if (!epochs.length && headSlot) {
      void fetchEpochBalances()
    }
  }, [headSlot, epochs])

  return {
    epochs: formattedEpochData,
  }
}

export default useValidatorEpochBalance
