import { formatUnits } from 'ethers'
import { selector } from 'recoil'
import { beaconNodeSpec } from '../atoms'

export const selectUpOffset = selector<number>({
  key: 'selectUpOffset',
  get: ({ get }) => {
    const beaconSpec = get(beaconNodeSpec)
    if (!beaconSpec) return 1.25

    const effectiveBalanceIncrement = Number(formatUnits(beaconSpec.EFFECTIVE_BALANCE_INCREMENT, 9))

    return (
      (Number(beaconSpec.HYSTERESIS_UPWARD_MULTIPLIER) / Number(beaconSpec.HYSTERESIS_QUOTIENT)) *
      effectiveBalanceIncrement
    )
  },
})
