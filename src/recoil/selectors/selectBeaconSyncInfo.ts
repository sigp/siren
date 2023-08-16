import { selector } from 'recoil'
import { beaconSyncInfo } from '../atoms'
import getPercentage from '../../utilities/getPercentage'
import { BeaconSyncInfo } from '../../types/diagnostic'

export const selectBeaconSyncInfo = selector<BeaconSyncInfo>({
  key: 'formattedBeaconSyncInfo',
  get: ({ get }) => {
    const data = get(beaconSyncInfo)

    const { head_slot, sync_distance, is_syncing } = data || {}
    const distance = head_slot + sync_distance

    return {
      headSlot: head_slot,
      slotDistance: distance,
      beaconPercentage: getPercentage(head_slot, distance),
      beaconSyncTime: sync_distance * 12,
      isSyncing: is_syncing,
    }
  },
})
