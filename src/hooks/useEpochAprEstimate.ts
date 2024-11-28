import { formatUnits } from 'ethers'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import calculateAprPercentage from '../../utilities/calculateAprPercentage'
import formatBalanceColor from '../../utilities/formatBalanceColor'
import { beaconNodeSpec } from '../recoil/atoms'
import { ValidatorCache } from '../types/validator'
import useFilteredValidatorCacheData from './useFilteredValidatorCacheData'

const useEpochAprEstimate = (validatorCacheData: ValidatorCache, indices?: string[]) => {
  const spec = useRecoilValue(beaconNodeSpec)
  const interval = Number(spec?.SECONDS_PER_SLOT) || 12
  const slotsInEpoch = Number(spec?.SLOTS_PER_EPOCH) || 32
  const filteredValidatorCache = useFilteredValidatorCacheData(validatorCacheData, indices)

  const formattedCache = useMemo(() => {
    return Object.values(filteredValidatorCache).map((cache) =>
      cache.map(({ total_balance }) => total_balance),
    )
  }, [filteredValidatorCache])

  const isValidEpochCount = formattedCache.every((subArr) => subArr.length > 1)

  const formatForWithdrawal = (arr: number[]) => {
    const foundIndex = arr.findIndex((value) => value > 32 && value < 32.001)
    return foundIndex === -1 ? arr : [arr[foundIndex], ...arr.slice(foundIndex + 1)]
  }

  const epochsInYear = (60 * 60 * 24 * 365) / (slotsInEpoch * interval)

  const mappedTotalApr = useMemo(() => {
    return formattedCache?.map((cache) => {
      const formattedValues = cache.map((value) => Number(formatUnits(value, 'gwei')))
      const formattedWithdrawalCache = formatForWithdrawal(formattedValues)

      const initialBalance = formattedWithdrawalCache[0]
      const currentBalance = formattedWithdrawalCache[formattedWithdrawalCache.length - 1]
      const rewards = currentBalance - initialBalance
      const epochGroupInYear = Math.ceil(epochsInYear / formattedWithdrawalCache.length)

      const rewardsMultiplied = rewards * epochGroupInYear
      const projectedBalance = rewardsMultiplied + initialBalance

      return calculateAprPercentage(projectedBalance, initialBalance)
    })
  }, [formattedCache, epochsInYear])

  return useMemo(() => {
    const estimatedApr =
      mappedTotalApr && isValidEpochCount
        ? mappedTotalApr.reduce((acc, a) => acc + a, 0) / mappedTotalApr.length
        : undefined
    const textColor = formatBalanceColor(estimatedApr)

    return {
      estimatedApr,
      textColor,
    }
  }, [mappedTotalApr, isValidEpochCount])
}

export default useEpochAprEstimate
