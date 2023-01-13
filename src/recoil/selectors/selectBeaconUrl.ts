import { selector } from 'recoil'
import { beaconNodeEndpoint } from '../atoms'

export const selectBeaconUrl = selector({
  key: 'beaconUrl',
  get: ({ get }) => {
    const beaconNode = get(beaconNodeEndpoint)
    if (!beaconNode) return undefined

    const { protocol, address, port } = beaconNode

    return `${protocol}://${address}:${port}`
  },
})
