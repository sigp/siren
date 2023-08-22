import { useRecoilValue } from 'recoil'
import { useMemo } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { validatorCacheBalanceResult } from '../recoil/atoms'
import { BALANCE_COLORS, secondsInSlot, slotsInEpoc } from '../constants/constants'
import moment from 'moment'
import { selectGenesisBlock } from '../recoil/selectors/selectGenesisBlock'
import getAverageValue from '../utilities/getAverageValue'
import { selectSlicedActiveValidators } from '../recoil/selectors/selectSlicedActiveValidators'

const useValidatorEpochBalance = () => {
  const validatorCacheData = useRecoilValue(validatorCacheBalanceResult)
  const activeValidators = useRecoilValue(selectSlicedActiveValidators)
  const genesisBlock = useRecoilValue(selectGenesisBlock) as number

  const formattedEpochData = useMemo(() => {
    return validatorCacheData && activeValidators.length && Object.values(validatorCacheData).length
      ? activeValidators
          .map(({ index, name }) => {
            const data = validatorCacheData[index as any] || []
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
  }, [activeValidators, validatorCacheData])

  const formattedTimestamps = useMemo(() => {
    const data = validatorCacheData && Object.values(validatorCacheData)[0]
    return data && genesisBlock
      ? data.map(({ epoch }) => {
          const slot = epoch * slotsInEpoc

          return moment((genesisBlock + slot * secondsInSlot) * 1000).format('HH:mm')
        })
      : []
  }, [validatorCacheData, genesisBlock])

  const isSufficientData = formattedTimestamps.length >= 3

  return {
    epochs: formattedEpochData,
    timestamps: formattedTimestamps,
    isSufficientData,
  }
}

export default useValidatorEpochBalance
