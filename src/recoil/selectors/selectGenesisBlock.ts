import { selector } from 'recoil';
import { fetchGenesisBlock } from '../../api/beacon';
import { beaconNodeEndpoint } from '../atoms';

export const selectGenesisBlock = selector({
  key: 'selectGenesisBlock',
  get: async ({ get }) => {
    const beaconEndpoint = get(beaconNodeEndpoint)

    const { data } = await fetchGenesisBlock(beaconEndpoint)

    return data ? Number(data?.data.genesis_time) : undefined
  },
})