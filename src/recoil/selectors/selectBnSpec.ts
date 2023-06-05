import { selector } from 'recoil'
import { fetchBnSpec } from '../../api/beacon'
import { BeaconNodeSpecResults } from '../../types/beacon'
import { selectBeaconUrl } from './selectBeaconUrl'

export const selectBnSpec = selector<BeaconNodeSpecResults>({
  key: 'selectBnSpec',
  get: async ({ get }) => {
    const beaconEndpoint = get(selectBeaconUrl)
    try {
      const { data } = await fetchBnSpec(beaconEndpoint)

      return data?.data
    } catch (e) {
      console.error(e)
      return undefined
    }
  },
})
