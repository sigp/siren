import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, validatorPeerCount, validatorSyncInterval } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'
import { useEffect } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'

const useValidatorPeerPolling = (time = secondsInSlot * 2000) => {
  const beaconEndpoint = useRecoilValue(selectBeaconUrl)
  const setPeerCount = useSetRecoilState(validatorPeerCount)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const url = `${beaconEndpoint}/eth/v1/node/peer_count`
  const setNetworkError = () => setBeaconNetworkError(true)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: validatorSyncInterval,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setPeerCount(Number(response?.data.data.connected || 0))
  }, [response])
}

export default useValidatorPeerPolling
