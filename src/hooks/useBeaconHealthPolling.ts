import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconHealthResult, beaconNetworkError, activeDevice } from '../recoil/atoms'
import { PollingOptions } from '../types'
import usePollApi from './usePollApi'

const useBeaconHealthPolling = (options?: PollingOptions) => {
  const { time = 6000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const url = `${beaconUrl}/lighthouse/ui/health`
  const setHealth = useSetRecoilState(beaconHealthResult)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { data } = usePollApi({
    key: 'beaconHealth',
    time,
    isReady,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    if (data) {
      setHealth(data.data)
    }
  }, [data])
}

export default useBeaconHealthPolling
