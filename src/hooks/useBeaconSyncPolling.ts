import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  beaconNetworkError,
  beaconNodeEndpoint,
  beaconSyncInfo,
  beaconSyncInterval,
} from '../recoil/atoms'
import { useEffect } from 'react'
import { secondsInSlot } from '../constants/constants'
import usePollApi from './usePollApi'

const useBeaconSyncPolling = (time = secondsInSlot * 1000) => {
  const beaconNode = useRecoilValue(beaconNodeEndpoint)
  const { protocol, address, port } = beaconNode || {}
  const url = beaconNode ? `${protocol}://${address}:${port}/eth/v1/node/syncing` : undefined
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: beaconSyncInterval,
    url,
    maxErrors: 2,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    if (!response) return

    const data = response.data.data

    setBeaconSyncInfo({
      ...data,
      head_slot: Number(data.head_slot),
      sync_distance: Number(data.sync_distance),
    })
  }, [response])
}

export default useBeaconSyncPolling
