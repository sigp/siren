import { formatUnits } from 'ethers'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { beaconNodeSpec } from '../recoil/atoms'

const useProcessEffectiveBalance = (
  actualBalance: number,
  effectiveBalance: number,
): { effective: number; remainder: number } => {
  const beaconSpec = useRecoilValue(beaconNodeSpec)

  const currentEffectiveBalance = Math.max(0, effectiveBalance)
  const currentActualBalance = Math.max(0, actualBalance)

  return useMemo(() => {
    if (!beaconSpec) return { effective: 0, remainder: 0 }

    const {
      EFFECTIVE_BALANCE_INCREMENT,
      HYSTERESIS_QUOTIENT,
      HYSTERESIS_UPWARD_MULTIPLIER,
      HYSTERESIS_DOWNWARD_MULTIPLIER,
    } = beaconSpec

    const effectiveBalanceIncrement = Number(formatUnits(EFFECTIVE_BALANCE_INCREMENT, 9))

    const UP_OFFSET =
      (Number(HYSTERESIS_UPWARD_MULTIPLIER) / Number(HYSTERESIS_QUOTIENT)) *
      effectiveBalanceIncrement
    const DN_OFFSET =
      (Number(HYSTERESIS_DOWNWARD_MULTIPLIER) / Number(HYSTERESIS_QUOTIENT)) *
      effectiveBalanceIncrement

    let effective = currentEffectiveBalance

    const aboveThreshold = currentActualBalance > effective + UP_OFFSET
    const belowThreshold = currentActualBalance < effective - DN_OFFSET

    if (aboveThreshold) {
      // step upward
      while (currentActualBalance > effective + UP_OFFSET) {
        effective = effective + effectiveBalanceIncrement
      }
    } else if (belowThreshold) {
      // step downward
      while (currentActualBalance < effective - DN_OFFSET) {
        effective = Math.max(effective - effectiveBalanceIncrement, 0)
      }
    }

    const remainder = Math.max(0, currentActualBalance - effective)
    return { effective, remainder }
  }, [currentActualBalance, currentEffectiveBalance, beaconSpec])
}

export default useProcessEffectiveBalance
