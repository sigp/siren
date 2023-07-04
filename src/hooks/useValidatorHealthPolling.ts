import { useRecoilValue, useSetRecoilState } from 'recoil'
import { validatorHealthResult, validatorNetworkError, activeDevice } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { useEffect } from 'react'
import { PollingOptions } from '../types'

const useValidatorHealthPolling = (options?: PollingOptions) => {
  const { time = 6000, isReady = true } = options || {}
  const { validatorUrl, apiToken } = useRecoilValue(activeDevice)
  const url = `${validatorUrl}/ui/health`
  const setHealth = useSetRecoilState(validatorHealthResult)
  const setValidatorNetworkError = useSetRecoilState(validatorNetworkError)

  const setNetworkError = () => setValidatorNetworkError(true)

  const { data } = usePollApi({
    key: 'validatorHealth',
    time,
    isReady,
    apiToken,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setHealth(data?.data)
  }, [data])
}

export default useValidatorHealthPolling
