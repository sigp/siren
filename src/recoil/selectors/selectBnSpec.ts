import { selector } from 'recoil'
import { beaconNodeEndpoint } from '../atoms'
import { fetchBnSpec } from '../../api/beacon'
import { BeaconNodeSpecResults } from '../../types/beacon'

export const selectBnSpec = selector<BeaconNodeSpecResults>({
  key: 'selectBnSpec',
  get: async ({ get }) => {
    const beaconEndpoint = get(beaconNodeEndpoint)

    try {
      const { data } = await fetchBnSpec(beaconEndpoint)

      return data?.data
    } catch (e) {
      console.error(e)
      return undefined
    }
  },
})
