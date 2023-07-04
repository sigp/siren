import { useRecoilValue, useSetRecoilState } from 'recoil'
import { activeDevice, beaconNetworkError, validatorPeerCount } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'
import { useEffect } from 'react'
import { PollingOptions } from '../types'

const useValidatorPeerPolling = (options?: PollingOptions) => {
  const { time = secondsInSlot * 2000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const setPeerCount = useSetRecoilState(validatorPeerCount)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const url = `${beaconUrl}/eth/v1/node/peer_count`
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
