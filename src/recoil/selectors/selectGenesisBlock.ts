import { selector } from 'recoil'
import { fetchGenesisBlock } from '../../api/beacon'
import { activeDevice } from '../atoms'

export const selectGenesisBlock = selector({
  key: 'selectGenesisBlock',
  get: async ({ get }) => {
    const { beaconUrl } = get(activeDevice)
    const { data } = await fetchGenesisBlock(beaconUrl)

    return data ? Number(data?.data.genesis_time) : undefined
  },
})
