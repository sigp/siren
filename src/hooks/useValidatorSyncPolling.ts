import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  beaconNetworkError,
  beaconNodeEndpoint,
  validatorSyncInfo,
  validatorSyncInterval,
} from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'

const useValidatorSyncPolling = (time = secondsInSlot * 1000) => {
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const { protocol, address, port } = beaconEndpoint
  const url = beaconEndpoint
    ? `${protocol}://${address}:${port}/lighthouse/eth1/syncing`
    : undefined
  const setResult = useSetRecoilState(validatorSyncInfo)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: validatorSyncInterval,
    url,
    maxErrors: 2,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setResult(response?.data.data)
  }, [response])
}

export default useValidatorSyncPolling
