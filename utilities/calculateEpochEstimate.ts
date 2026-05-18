import { FormattedValidatorCache } from '../src/types/validator'
import { slotsInEpoc } from '../src/constants/constants'
import reduceAddNum from './reduceAddNum'
import { NetworkProfile } from './getNetworkProfile'
import { gweiToNative } from './gweiToNative'

const calculateEpochEstimate = (
  timeInSeconds: number,
  secondsInSlot: number,
  epochs?: FormattedValidatorCache,
  profile?: NetworkProfile,
  slotsPerEpoch: number = slotsInEpoc,
) => {
  let difference = 0
  if (!epochs) return difference

  const epochValues = Object.values(epochs)
  const epochCount = epochValues.length

  if (!epochCount || epochCount === 1) return difference

  const timeMultiplier = Number(timeInSeconds) / (secondsInSlot * slotsPerEpoch * epochCount)

  difference =
    epochValues[epochValues.length - 1].reduce(reduceAddNum, 0) -
    epochValues[0].reduce(reduceAddNum, 0)

  const scaledGwei = Math.floor(difference * timeMultiplier)
  const effectiveProfile = profile ?? ({ gweiDivisor: 1 } as NetworkProfile)
  return gweiToNative(scaledGwei, effectiveProfile)
}

export default calculateEpochEstimate
