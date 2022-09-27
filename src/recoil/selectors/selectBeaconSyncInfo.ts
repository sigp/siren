import { selector } from 'recoil'
import axios from 'axios'
import { selectBeaconUrl } from './selectBeaconUrl'

export const selectBeaconSyncInfo = selector({
  key: 'BeaconSyncInfo',
  get: async ({ get }) => {
    const baseBeaconUrl = get(selectBeaconUrl)
    const { data } = await axios.get(`${baseBeaconUrl}/v1/node/syncing`)

    return data
  },
})
