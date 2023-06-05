import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, validatorPeerCount } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'
import { useEffect } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { PollingOptions } from '../types'

const useValidatorPeerPolling = (options?: PollingOptions) => {
  const { time = secondsInSlot * 2000, isReady = true } = options || {}
  const beaconEndpoint = useRecoilValue(selectBeaconUrl)
  const setPeerCount = useSetRecoilState(validatorPeerCount)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const url = `${beaconEndpoint}/eth/v1/node/peer_count`
  const setNetworkError = () => setBeaconNetworkError(true)

  const { data } = usePollApi({
    key: 'validatorPeers',
    isReady,
    time,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setPeerCount(Number(data?.data.connected || 0))
  }, [data])
}

export default useValidatorPeerPolling
