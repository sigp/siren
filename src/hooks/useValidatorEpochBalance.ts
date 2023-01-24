import { useRecoilState, useRecoilValue } from 'recoil'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { fetchValidatorBalanceCache } from '../api/beacon'
import { ValidatorCacheResults } from '../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { beaconEpochInterval, beaconNodeEndpoint, validatorStateInfo } from '../recoil/atoms'
import { BALANCE_COLORS, secondsInSlot, slotsInEpoc } from '../constants/constants'
import moment from 'moment'
import { selectGenesisBlock } from '../recoil/selectors/selectGenesisBlock'
import usePollingInterval from './usePollingInterval'
import getAverageValue from '../utilities/getAverageValue'

const useValidatorEpochBalance = () => {
  const [validatorData, setData] = useState<ValidatorCacheResults>()
  const validators = useRecoilValue(selectValidators)
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const validatorInfo = useRecoilValue(validatorStateInfo)
  const genesisBlock = useRecoilValue(selectGenesisBlock) as number
  const [epochInterval, setInterval] = useRecoilState(beaconEpochInterval)

  const activeValidators = useMemo(() => {
    return validatorInfo
      ? validatorInfo
          .map(({ status, validator, index }) => {
            const { name, pubKey } =
              validators.find(({ pubKey }) => pubKey === validator.pubkey) || {}
            return { status, pubKey, index, name }
          })
          .filter(({ status }) => status.includes('active') && !status.includes('slashed'))
          .slice(0, 10)
      : []
  }, [validatorInfo, validators])

  const fetchValidatorBalances = useCallback(async () => {
    const activeIndices = activeValidators.map((validator) => Number(validator.index))

    if (!activeIndices.length) return

    const { data } = await fetchValidatorBalanceCache(beaconEndpoint, activeIndices)

    if (data) {
      setData(data.data.validators)
    }
  }, [activeValidators])

  useEffect(() => {
    if (activeValidators.length && beaconEndpoint && !validatorData) {
      void fetchValidatorBalances()
    }
  }, [activeValidators, beaconEndpoint, validatorData])

  const formattedEpochData = useMemo(() => {
    return validatorData && activeValidators.length && Object.values(validatorData).length
      ? activeValidators
          .map(({ index, name }) => {
            const data = validatorData[index as any]?.info
            return {
              index,
              name,
              data: data.map(({ total_balance }) => Number(formatUnits(total_balance, 'gwei'))),
            }
          })
          .sort((a, b) => getAverageValue(a.data) - getAverageValue(b.data))
          .map((data, index) => ({
            ...data,
            color: BALANCE_COLORS[index],
          }))
      : []
  }, [activeValidators, validatorData])

  const formattedTimestamps = useMemo(() => {
    const data = validatorData && Object.values(validatorData)[0]
    return data
      ? data.info.map(({ epoch }) => {
          const slot = epoch * slotsInEpoc

          return moment((genesisBlock + slot * secondsInSlot) * 1000).format('HH:mm')
        })
      : []
  }, [validatorData, genesisBlock])

  const isSufficientData = formattedTimestamps.length >= 3

  const onClearInterval = () => setInterval(undefined)

  const { intervalId } = usePollingInterval(fetchValidatorBalances, 60000, {
    isSkip: Boolean(activeValidators && activeValidators.length) && Boolean(epochInterval),
    onClearInterval,
  })

  useEffect(() => {
    if (intervalId) {
      setInterval(intervalId)
    }
  }, [intervalId])

  return {
    epochs: formattedEpochData,
    timestamps: formattedTimestamps,
    isSufficientData,
  }
}

export default useValidatorEpochBalance
