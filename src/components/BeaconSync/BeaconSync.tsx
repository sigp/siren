import React, { FC, ReactNode, useEffect } from 'react'
import { secondsInSlot } from '../../constants/constants'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { beaconNodeEndpoint, beaconSyncInfo, beaconSyncIntervalId } from '../../recoil/atoms';
import { fetchSyncStatus } from '../../api/beacon'

export interface BeaconSyncProps {
  children: ReactNode | ReactNode[]
}

const BeaconSync: FC<BeaconSyncProps> = ({ children }) => {
  const beaconNode = useRecoilValue(beaconNodeEndpoint)
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo);
  const [intervalId, setIntervalId] = useRecoilState(beaconSyncIntervalId)

  const fetchSyncInfo = async () => {
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
    if(!intervalId) {
      void fetchSyncInfo()
      const id = setInterval(() => fetchSyncInfo(), secondsInSlot * 1000)
      setIntervalId(id);

      return () => {
        if(intervalId) {
          clearInterval(intervalId)
          setIntervalId(undefined);
        }
      }
    }


  }, [intervalId])

  return (
    <>
      {children}
    </>
  )
}

export default BeaconSync
