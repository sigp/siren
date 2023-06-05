import { selector } from 'recoil'
import { fetchGenesisBlock } from '../../api/beacon'
import { selectBeaconUrl } from './selectBeaconUrl'

export const selectGenesisBlock = selector({
  key: 'selectGenesisBlock',
  get: async ({ get }) => {
    const beaconEndpoint = get(selectBeaconUrl)
    const { data } = await fetchGenesisBlock(beaconEndpoint)

    return data ? Number(data?.data.genesis_time) : undefined
  },
})
