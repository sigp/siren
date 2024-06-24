import { FormattedValidatorCache } from '../src/types/validator'
import { slotsInEpoc } from '../src/constants/constants'
import reduceAddNum from './reduceAddNum'
import { formatUnits } from 'ethers'

const calculateEpochEstimate = (
  timeInSeconds: number,
  secondsInSlot: number,
  epochs?: FormattedValidatorCache,
) => {
  let difference = 0
  if (!epochs) return difference

  const epochValues = Object.values(epochs)
  const epochCount = epochValues.length

  if (!epochCount || epochCount === 1) return difference

  const timeMultiplier = Number(timeInSeconds) / (secondsInSlot * slotsInEpoc * epochCount)

  difference =
    epochValues[epochValues.length - 1].reduce(reduceAddNum, 0) -
    epochValues[0].reduce(reduceAddNum, 0)

  return Number(formatUnits(Math.floor(difference * timeMultiplier), 'gwei'))
}

export default calculateEpochEstimate
