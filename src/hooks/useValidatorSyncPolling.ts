import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNodeEndpoint, validatorSyncInfo, validatorSyncInterval } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'

const useValidatorSyncPolling = (time = secondsInSlot * 1000) => {
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const { protocol, address, port } = beaconEndpoint
  const url = beaconEndpoint
    ? `${protocol}://${address}:${port}/lighthouse/eth1/syncing`
    : undefined
  const setResult = useSetRecoilState(validatorSyncInfo)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: validatorSyncInterval,
    url,
  })

  useEffect(() => {
    setResult(response?.data.data)
  }, [response])
}

export default useValidatorSyncPolling
