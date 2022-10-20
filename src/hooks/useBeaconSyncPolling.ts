import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNodeEndpoint, beaconSyncInfo, beaconSyncInterval } from '../recoil/atoms'
import { fetchSyncStatus } from '../api/beacon'
import { useEffect } from 'react'
import usePollingInterval from './usePollingInterval'
import { secondsInSlot } from '../constants/constants'

const useBeaconSyncPolling = () => {
  const beaconNode = useRecoilValue(beaconNodeEndpoint)
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo)

  const [interval, setIntervalId] = useRecoilState(beaconSyncInterval)
  const isSkip = Boolean(interval)

  const fetchBeaconInfo = async () => {
    try {
      const { data } = await fetchSyncStatus(beaconNode)

      setBeaconSyncInfo({
        ...data.data,
        head_slot: Number(data.data.head_slot),
        sync_distance: Number(data.data.sync_distance),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const { intervalId } = usePollingInterval(fetchBeaconInfo, secondsInSlot * 1000, { isSkip })

  useEffect(() => {
    if (intervalId) {
      setIntervalId(intervalId)
    }
  }, [intervalId])

  useEffect(() => {
    void fetchBeaconInfo()
  }, [])
}

export default useBeaconSyncPolling
