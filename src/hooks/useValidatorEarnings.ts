import { useRecoilValue } from 'recoil'
import { useEffect, useMemo, useState } from 'react'
import { FormattedValidatorCache } from '../types/validator'
import {
  initialEthDeposit,
  secondsInDay,
  secondsInHour,
  secondsInWeek,
} from '../constants/constants'
import calculateEpochEstimate from '../utilities/calculateEpochEstimate'
import { selectValidatorInfos } from '../recoil/selectors/selectValidatorInfos'
import calculateAprPercentage from '../utilities/calculateAprPercentage'
import useFilteredValidatorCacheData from './useFilteredValidatorCacheData'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'

const useValidatorEarnings = (indices?: string[]) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const validators = useRecoilValue(selectValidatorInfos)

  const filteredCacheData = useFilteredValidatorCacheData(indices)
  const filteredValidators = useMemo(() => {
    return indices ? validators.filter(({ index }) => indices.includes(String(index))) : validators
  }, [validators, indices])

  const formattedEpochs = useMemo(() => {
    if (!filteredCacheData) return undefined

    return Object.values(filteredCacheData)
      .flat()
      .reduce(function (r, a) {
        r[a.epoch] = r[a.epoch] || []
        r[a.epoch].push(a.total_balance)
        return r
      }, Object.create({}))
  }, [filteredCacheData])
  const epochKeys = formattedEpochs ? Object.keys(formattedEpochs) : undefined
  const lastEpoch = epochKeys ? epochKeys[epochKeys.length - 1] : undefined

  const [epochCaches, setCaches] = useState<FormattedValidatorCache | undefined>()

  useEffect(() => {
    setCaches((prev) => Object.assign({} as FormattedValidatorCache, prev, formattedEpochs))
  }, [lastEpoch])

  const total = useMemo(() => {
    return filteredValidators.map((validator) => validator.balance).reduce((a, b) => a + b, 0)
  }, [filteredValidators])

  const totalEarnings = useMemo(() => {
    return filteredValidators.map((validator) => validator.rewards).reduce((a, b) => a + b, 0)
  }, [filteredValidators])

  const hourlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInHour, SECONDS_PER_SLOT, epochCaches),
    [epochCaches, SECONDS_PER_SLOT],
  )

  const dailyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInDay, SECONDS_PER_SLOT, epochCaches),
    [epochCaches, SECONDS_PER_SLOT],
  )

  const weeklyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek, SECONDS_PER_SLOT, epochCaches),
    [epochCaches, SECONDS_PER_SLOT],
  )

  const monthlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek * 4, SECONDS_PER_SLOT, epochCaches),
    [epochCaches, SECONDS_PER_SLOT],
  )

  const initialEth = filteredValidators.length * initialEthDeposit
  const annualizedEarningsPercent = calculateAprPercentage(total, initialEth)

  return {
    total,
    totalEarnings,
    annualizedEarningsPercent,
    hourlyEstimate,
    dailyEstimate,
    weeklyEstimate,
    monthlyEstimate,
  }
}

export default useValidatorEarnings
