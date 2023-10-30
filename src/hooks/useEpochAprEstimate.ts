import useFilteredValidatorCacheData from './useFilteredValidatorCacheData'
import { useMemo } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { secondsInDay, slotsInEpoc } from '../constants/constants'
import calculateAprPercentage from '../utilities/calculateAprPercentage'
import formatBalanceColor from '../utilities/formatBalanceColor'
import { useRecoilValue } from 'recoil'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'

const useEpochAprEstimate = (indices?: string[]) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const filteredValidatorCache = useFilteredValidatorCacheData(indices)

  const formattedCache = useMemo(() => {
    if (!filteredValidatorCache) return
    return Object.values(filteredValidatorCache).map((cache) =>
      cache.map(({ total_balance }) => total_balance),
    )
  }, [filteredValidatorCache])

  const isValidEpochCount = formattedCache?.every((subArr) => subArr.length > 1)

  const formatForWithdrawal = (arr: number[]) => {
    const foundIndex = arr.findIndex((value) => value > 32 && value < 32.001)
    return foundIndex === -1 ? arr : [arr[foundIndex], ...arr.slice(foundIndex + 1)]
  }

  const mappedTotalApr = useMemo(() => {
    return formattedCache?.map((cache) => {
      const formattedValues = cache.map((value) => Number(formatUnits(value, 'gwei')))
      const formattedWithdrawalCache = formatForWithdrawal(formattedValues)

      const initialBalance = formattedWithdrawalCache[0]
      const currentBalance = formattedWithdrawalCache[formattedWithdrawalCache.length - 1]
      const rewards = currentBalance - initialBalance
      const multiplier =
        (secondsInDay * 365) / (SECONDS_PER_SLOT * slotsInEpoc) / formattedWithdrawalCache.length

      const rewardsMultiplied = rewards * multiplier
      const projectedBalance = rewardsMultiplied + initialBalance

      return calculateAprPercentage(projectedBalance, initialBalance)
    })
  }, [formattedCache])

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
