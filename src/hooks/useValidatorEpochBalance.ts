import { useRecoilValue } from 'recoil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { fetchValidatorStatuses } from '../api/beacon'
import { BeaconValidatorResult, ValidatorEpochData, ValidatorStatusInfo } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import { validatorStateInfo } from '../recoil/atoms'
import { secondsInEpoch, slotsInEpoc } from '../constants/constants'
import { selectAtHeadSlot } from '../recoil/selectors/selectAtHeadSlot'
import moment from 'moment'

const useValidatorEpochBalance = () => {
  const validators = useRecoilValue(selectValidators)
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const validatorInfo = useRecoilValue(validatorStateInfo)
  const { headSlot } = useRecoilValue(selectBeaconSyncInfo)
  const atHeadSlot = useRecoilValue(selectAtHeadSlot)

  const [epochs, setEpochs] = useState<{ epochs: BeaconValidatorResult[]; timestamp?: string }[]>(
    [],
  )

  const updateEpochs = useCallback(() => {
    setEpochs((prev) => [
      { epochs: validatorInfo, timestamp: moment().format('HH:mm') },
      ...prev.slice(0, -1),
    ])
  }, [validatorInfo])

  const activeValidators = useMemo(() => {
    return validatorInfo
      ?.map(({ status, validator }) => ({ status, pubKey: validator.pubkey }))
      .filter(({ status }) => status.includes('active') && !status?.includes('slashed'))
  }, [validatorInfo])

  useEffect(() => {
    if ((atHeadSlot || 0) < -5 && !!activeValidators) {
      void fetchEpochBalances(activeValidators)
    }
  }, [atHeadSlot, activeValidators])

  const fetchStatus = async (
    baseBeaconUrl: string,
    validatorKeys: string,
    epoch: string,
    timestamp: string,
  ) => {
    const { data } = await fetchValidatorStatuses(baseBeaconUrl, validatorKeys, epoch)

    return {
      data,
      timestamp,
    }
  }

  useEffect(() => {
    if (headSlot % slotsInEpoc === 0) {
      updateEpochs()
    }
  }, [headSlot])

  const fetchEpochBalances = async (validators: ValidatorStatusInfo[]) => {
    if (!baseBeaconUrl) return

    // Need to obtain the value of the head slot on each epoch boundary.
    const closest_epoch_slot = Math.floor(headSlot / 32) * 32
    const slotByEpoch = Array.from(Array(10).keys()).map((i) => ({
      epoch: closest_epoch_slot - 32 * i,
      timestamp: moment()
        .subtract(secondsInEpoch * i, 's')
        .format('HH:mm'),
    }))

    const results = await Promise.all(
      slotByEpoch.map(({ epoch, timestamp }) => {
        return epoch > 0
          ? fetchStatus(
              baseBeaconUrl,
              validators.map((validator) => validator.pubKey).join(),
              epoch.toString(),
              timestamp,
            )
          : { data: [], timestamp: undefined }
      }),
    )

    const validatorsEpochs = results
      .map((data) => ({ epochs: data.data.data, timestamp: data?.timestamp }))
      .filter((data) => data !== undefined)

    setEpochs(validatorsEpochs)
  }

  const isSufficientData = epochs.filter((epoch) => !!epoch?.epochs).length > 2

  const formattedEpochData = useMemo<ValidatorEpochData[]>(() => {
    return epochs.length
      ? validators
          .filter(
            (validator) =>
              activeValidators.filter(({ pubKey }) => pubKey === validator.pubKey).length,
          )
          .slice(0, 10)
          .map(({ pubKey, name }) => ({
            name,
            data: epochs
              .map((data) =>
                data?.epochs
                  ? data.epochs
                      .filter((data: BeaconValidatorResult) => data.validator.pubkey === pubKey)
                      .map((data: BeaconValidatorResult) =>
                        Number(formatUnits(data.balance, 'gwei')),
                      )
                  : [],
              )
              .flat()
              .reverse(),
          }))
      : []
  }, [epochs, validators, activeValidators])
  const formattedTimestamps = useMemo(() => {
    return epochs.map((data) => data.timestamp).reverse() as string[]
  }, [epochs])

  useEffect(() => {
    if (!epochs.length && headSlot && !!activeValidators) {
      void fetchEpochBalances(activeValidators)
    }
  }, [headSlot, epochs, activeValidators])

  return {
    epochs: formattedEpochData,
    timestamps: formattedTimestamps,
    isSufficientData,
  }
}

export default useValidatorEpochBalance
