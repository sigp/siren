import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, validatorSyncInfo, validatorSyncInterval } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { secondsInSlot } from '../constants/constants'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'

const useValidatorSyncPolling = (time = secondsInSlot * 1000) => {
  const beaconEndpoint = useRecoilValue(selectBeaconUrl)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const url = `${beaconEndpoint}/lighthouse/eth1/syncing`
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
