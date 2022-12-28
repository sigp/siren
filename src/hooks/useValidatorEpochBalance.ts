import { useRecoilValue } from 'recoil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { fetchValidatorStatuses } from '../api/beacon'
import { BeaconValidatorResult, ValidatorEpochData } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import { validatorStateInfo } from '../recoil/atoms'
import { secondsInSlot, slotsInEpoc } from '../constants/constants'
import moment from 'moment'
import { selectGenesisBlock } from '../recoil/selectors/selectGenesisBlock'
import usePrevious from './usePrevious'
import getAtHeadSlot from '../utilities/getAtHeadSlot'

const useValidatorEpochBalance = () => {
  const validators = useRecoilValue(selectValidators)
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl) as string
  const validatorInfo = useRecoilValue(validatorStateInfo)
  const { headSlot } = useRecoilValue(selectBeaconSyncInfo)
  const genesisBlock = useRecoilValue(selectGenesisBlock) as number
  const [isChartRefresh, setIsRefresh] = useState(false)

  const prevHeadSlot = usePrevious(headSlot)

  const getPrevAtHeadSlot = useCallback(
    (prevHead: number) => {
      return getAtHeadSlot(genesisBlock, prevHead)
    },
    [genesisBlock],
  )

  const [epochs, setEpochs] = useState<{ epochs: BeaconValidatorResult[]; timestamp?: string }[]>(
    [],
  )

  const updateEpochs = useCallback(() => {
    setEpochs((prev) => [
      { epochs: validatorInfo, timestamp: moment().format('HH:mm') },
      ...prev.slice(0, -1),
    ])
  }, [validatorInfo, genesisBlock])

  const activeValidators = useMemo(() => {
    return validatorInfo
      ?.map(({ status, validator }) => ({ status, pubKey: validator.pubkey }))
      .filter(({ status }) => status.includes('active') && !status?.includes('slashed'))
  }, [validatorInfo])

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

  const fetchEpochBalances = useCallback(async () => {
    // Need to obtain the value of the head slot on each epoch boundary.
    const closest_epoch_slot = Math.floor(headSlot / slotsInEpoc) * slotsInEpoc
    const slotByEpoch = Array.from(Array(10).keys()).map((i) => {
      const epoch = closest_epoch_slot - slotsInEpoc * i
      return {
        epoch,
        timestamp: moment((genesisBlock + epoch * secondsInSlot) * 1000).format('HH:mm'),
      }
    })

    const results = await Promise.all(
      slotByEpoch.map(({ epoch, timestamp }) => {
        return epoch > 0
          ? fetchStatus(
              baseBeaconUrl,
              activeValidators.map((validator) => validator.pubKey).join(),
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
  }, [activeValidators, baseBeaconUrl, headSlot])

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
      void fetchEpochBalances()
    }
  }, [headSlot, epochs, activeValidators])

  useEffect(() => {
    if (headSlot % slotsInEpoc === 0) {
      updateEpochs()
    }
  }, [headSlot])

  useEffect(() => {
    if (isChartRefresh && Boolean(headSlot && prevHeadSlot) && headSlot === prevHeadSlot) {
      void fetchEpochBalances()
      setIsRefresh(false)
    }
  }, [headSlot, prevHeadSlot, isChartRefresh])

  useEffect(() => {
    if (!prevHeadSlot || !headSlot) return
    const isLateSlot = (getPrevAtHeadSlot(prevHeadSlot) || 0) < -5

    if (isLateSlot && prevHeadSlot !== headSlot) {
      console.log(getPrevAtHeadSlot(prevHeadSlot))
      setIsRefresh(true)
    }
  }, [prevHeadSlot, headSlot])

  return {
    epochs: formattedEpochData,
    timestamps: formattedTimestamps,
    isSufficientData,
  }
}

export default useValidatorEpochBalance
