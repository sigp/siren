import { selector } from 'recoil'
import { beaconNodeEndpoint } from '../atoms'
import formatEndpoint from '../../utilities/formatEndpoint'

export const selectBeaconUrl = selector<string>({
  key: 'beaconUrl',
  get: ({ get }) => {
    const beaconNode = get(beaconNodeEndpoint)
    return formatEndpoint(beaconNode) as string
  },
})
