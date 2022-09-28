import { selector } from 'recoil'
import axios from 'axios'
import { selectBeaconUrl } from './selectBeaconUrl'
import { BeaconSyncResult } from '../../types/diagnostic'

export const selectBeaconSyncInfo = selector<BeaconSyncResult>({
  key: 'BeaconSyncInfo',
  get: async ({ get }) => {
    const baseBeaconUrl = get(selectBeaconUrl)
    const { data } = await axios.get(`${baseBeaconUrl}/v1/node/syncing`)

    return {
      ...data.data,
      head_slot: Number(data.data.head_slot),
      sync_distance: Number(data.data.sync_distance),
    }
  },
})
