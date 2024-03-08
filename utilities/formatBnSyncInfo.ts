import { BeaconSyncInfo, BeaconSyncResult } from '../src/types/diagnostic';
import getPercentage from './getPercentage';

const formatBnSyncInfo = (data: BeaconSyncResult): BeaconSyncInfo => {
  const { head_slot, sync_distance, is_syncing } = data

  const distance = head_slot + sync_distance

  return {
    headSlot: head_slot,
    slotDistance: distance,
    beaconPercentage: getPercentage(head_slot, distance),
    beaconSyncTime: sync_distance * 12,
    isSyncing: is_syncing,
  }
}

export default formatBnSyncInfo