import { selector } from 'recoil'
import formatChainId from '../../../utilities/formatChainId'
import { beaconNodeSpec } from '../atoms'

export const selectBnChain = selector({
  key: 'selectBnChain',
  get: ({ get }) => {
    const specs = get(beaconNodeSpec)
    if (!specs) return
    const { DEPOSIT_CHAIN_ID } = specs
    return formatChainId(DEPOSIT_CHAIN_ID)
  },
})
