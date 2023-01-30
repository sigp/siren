import { FormattedValidatorCache } from '../types/validator'
import { secondsInEpoch } from '../constants/constants'
import reduceAddNum from './reduceAddNum'
import { formatUnits } from 'ethers/lib/utils'

const calculateEpochEstimate = (timeInSeconds: number, epochs?: FormattedValidatorCache) => {
  let difference = 0
  if (!epochs) return difference

  const epochValues = Object.values(epochs)
  const epochCount = epochValues.length

  if (!epochCount || epochCount === 1) return difference

  const timeMultiplier = timeInSeconds / (secondsInEpoch * epochCount)

  difference =
    epochValues[epochValues.length - 1].reduce(reduceAddNum, 0) -
    epochValues[0].reduce(reduceAddNum, 0)

  return Number(formatUnits(Math.floor(difference * timeMultiplier), 'gwei'))
}

export default calculateEpochEstimate
