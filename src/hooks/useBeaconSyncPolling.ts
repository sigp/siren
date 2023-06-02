import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, beaconSyncInfo } from '../recoil/atoms'
import { useEffect } from 'react'
import { secondsInSlot } from '../constants/constants'
import usePollApi from './usePollApi'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { PollingOptions } from '../types'

const useBeaconSyncPolling = (options?: PollingOptions) => {
  const { time = secondsInSlot * 1000, isReady = true } = options || {}
  const beaconNode = useRecoilValue(selectBeaconUrl)
  const url = `${beaconNode}/eth/v1/node/syncing`
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { data } = usePollApi({
    key: 'beaconSync',
    time,
    isReady: !!url && isReady,
    url,
    maxErrors: 2,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    if (!data) return
    const info = data.data

    setBeaconSyncInfo({
      ...info,
      head_slot: Number(info.head_slot),
      sync_distance: Number(info.sync_distance),
    })
  }, [data])
}

export default useBeaconSyncPolling
