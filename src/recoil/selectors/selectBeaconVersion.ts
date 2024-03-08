import { selector } from 'recoil'
import formatNodeVersion from '../../../utilities/formatNodeVersion'
import { NodeVersion } from '../../types'
import { beaconVersionData } from '../atoms'

export const selectBeaconVersion = selector<NodeVersion | undefined>({
  key: 'selectBeaconVersion',
  get: ({ get }) => {
    const beacon = get(beaconVersionData)
    return beacon ? formatNodeVersion(beacon) : undefined
  },
})
