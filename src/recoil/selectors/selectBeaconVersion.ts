import { selector } from 'recoil';
import { beaconVersionData } from '../atoms';
import { NodeVersion } from '../../types';

export const selectBeaconVersion = selector<NodeVersion | undefined>({
  key: 'selectBeaconVersion',
  get: ({ get }) => {
    const beacon = get(beaconVersionData)

    if(!beacon) return;

    const version = beacon.split('/')[1]
    const split = version.split('-')

    return {
      version: split[0],
      id: split[1]
    }
  },
})