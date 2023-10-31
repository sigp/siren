import { useRecoilValue } from 'recoil'
import { useMemo } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { validatorCacheBalanceResult } from '../recoil/atoms'
import { BALANCE_COLORS, slotsInEpoc } from '../constants/constants'
import moment from 'moment'
import { selectGenesisBlock } from '../recoil/selectors/selectGenesisBlock'
import getAverageValue from '../utilities/getAverageValue'
import { selectSlicedActiveValidators } from '../recoil/selectors/selectSlicedActiveValidators'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'

const useValidatorEpochBalance = () => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
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

          return moment((genesisBlock + slot * SECONDS_PER_SLOT) * 1000).format('HH:mm')
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
