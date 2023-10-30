import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, beaconSyncInfo, activeDevice } from '../recoil/atoms'
import { useEffect } from 'react'
import usePollApi from './usePollApi'
import { PollingOptions } from '../types'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'

const useBeaconSyncPolling = (options?: PollingOptions) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)

  const { time = SECONDS_PER_SLOT * 1000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const url = `${beaconUrl}/eth/v1/node/syncing`
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
