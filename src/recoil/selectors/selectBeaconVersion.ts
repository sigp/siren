import { selector } from 'recoil'
import { beaconVersionData } from '../atoms'
import { NodeVersion } from '../../types'
import formatNodeVersion from '../../utilities/formatNodeVersion'

export const selectBeaconVersion = selector<NodeVersion | undefined>({
  key: 'selectBeaconVersion',
  get: ({ get }) => {
    const beacon = get(beaconVersionData)
    return beacon ? formatNodeVersion(beacon) : undefined
  },
})
