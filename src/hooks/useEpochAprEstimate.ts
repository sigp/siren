import useFilteredValidatorCacheData from './useFilteredValidatorCacheData'
import { useMemo } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { secondsInDay, secondsInEpoch } from '../constants/constants'
import calculateAprPercentage from '../utilities/calculateAprPercentage'
import formatBalanceColor from '../utilities/formatBalanceColor'
import { TypographyColor } from '../components/Typography/Typography'

const useEpochAprEstimate = (indices?: string[]) => {
  const filteredValidatorCache = useFilteredValidatorCacheData(indices)

  const formattedCache = useMemo(() => {
    if (!filteredValidatorCache) return
    return Object.values(filteredValidatorCache).map((cache) =>
      cache.map(({ total_balance }) => total_balance),
    )
  }, [filteredValidatorCache])

  const isValidEpochCount = formattedCache?.every((subArr) => subArr.length > 0)

  if (!isValidEpochCount || !formattedCache)
    return {
      estimatedApr: undefined,
      textColor: 'text-dark500' as TypographyColor,
    }

  const totalInitialBalance = Number(
    formatUnits(
      formattedCache.reduce((acc, validator) => acc + Number(validator[0]), 0) as number,
      'gwei',
    ),
  )
  const totalCurrentBalance = Number(
    formatUnits(
      formattedCache.reduce(
        (acc, validator) => acc + Number(validator[validator?.length - 1]),
        0,
      ) as number,
      'gwei',
    ),
  )

  const rewards = totalCurrentBalance - totalInitialBalance
  const multiplier = (secondsInDay * 365) / secondsInEpoch / formattedCache[0].length

  const rewardsMultiplied = rewards * multiplier

  const projectedTotalBalance = rewardsMultiplied + totalCurrentBalance

  const estimatedApr = calculateAprPercentage(projectedTotalBalance, totalInitialBalance)

  const textColor = formatBalanceColor(estimatedApr)

  return {
    estimatedApr,
    textColor,
  }
}

export default useEpochAprEstimate
