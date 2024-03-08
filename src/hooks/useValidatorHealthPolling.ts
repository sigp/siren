import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { validatorHealthResult, validatorNetworkError, activeDevice } from '../recoil/atoms'
import { PollingOptions } from '../types'
import usePollApi from './usePollApi'

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
