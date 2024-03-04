import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { activeDevice, beaconNetworkError, validatorSyncInfo } from '../recoil/atoms'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'
import { PollingOptions } from '../types'
import usePollApi from './usePollApi'

const useValidatorSyncPolling = (options?: PollingOptions) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const { time = SECONDS_PER_SLOT * 1000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const url = `${beaconUrl}/lighthouse/eth1/syncing`
  const setResult = useSetRecoilState(validatorSyncInfo)

  const setNetworkError = () => setBeaconNetworkError(true)

  const { data } = usePollApi({
    key: 'validatorSync',
    isReady,
    time,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setResult(data?.data)
  }, [data])
}

export default useValidatorSyncPolling
