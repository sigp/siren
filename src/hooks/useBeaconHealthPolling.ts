import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconHealthResult, beaconHealthSyncInterval, beaconNetworkError } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { useEffect } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'

const useBeaconHealthPolling = (time = 6000) => {
  const beaconEndpoint = useRecoilValue(selectBeaconUrl)
  const url = `${beaconEndpoint}/lighthouse/ui/health`
  const setHealth = useSetRecoilState(beaconHealthResult)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: beaconHealthSyncInterval,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setHealth(response?.data.data)
  }, [response])
}

export default useBeaconHealthPolling
