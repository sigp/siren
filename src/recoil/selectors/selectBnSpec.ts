import { selector } from 'recoil'
import { fetchBnSpec } from '../../api/beacon'
import { BeaconNodeSpecResults } from '../../types/beacon'
import { activeDevice } from '../atoms'

export const selectBnSpec = selector<BeaconNodeSpecResults>({
  key: 'selectBnSpec',
  get: async ({ get }) => {
    const { beaconUrl } = get(activeDevice)
    try {
      const { data } = await fetchBnSpec(beaconUrl)

      return data?.data
    } catch (e) {
      console.error(e)
      return undefined
    }
  },
})
