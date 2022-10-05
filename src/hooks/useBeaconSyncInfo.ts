import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'

const useBeaconSyncInfo = () => {
  const data = useRecoilValue(selectBeaconSyncInfo)

  const beaconPercentage = useMemo(() => {
    const { head_slot, sync_distance } = data
    const distance = head_slot + sync_distance

    return getPercentage(head_slot, distance)
  }, [data])
  const beaconSyncTime = useMemo(() => {
    const { sync_distance } = data
    return sync_distance * 12
  }, [data])

  return {
    headSlot: data.head_slot,
    slotDistance: data.head_slot + data.sync_distance,
    beaconPercentage,
    beaconSyncTime,
    isSyncing: data.is_syncing
  }
}

export default useBeaconSyncInfo
