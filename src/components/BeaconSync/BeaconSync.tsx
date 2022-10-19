import React, { FC, ReactNode, useEffect } from 'react'
import { secondsInSlot } from '../../constants/constants'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNodeEndpoint, beaconSyncInfo } from '../../recoil/atoms'
import { fetchSyncStatus } from '../../api/beacon'
import usePollingInterval from '../../hooks/usePollingInterval'

export interface BeaconSyncProps {
  children: ReactNode | ReactNode[]
}

const BeaconSync: FC<BeaconSyncProps> = ({ children }) => {
  const beaconNode = useRecoilValue(beaconNodeEndpoint)
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo)

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

  useEffect(() => {
    void fetchBeaconInfo()
  }, [])

  usePollingInterval(fetchBeaconInfo, secondsInSlot * 1000)

  return <>{children}</>
}

export default BeaconSync
