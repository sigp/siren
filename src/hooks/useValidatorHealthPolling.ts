import { useRecoilValue, useSetRecoilState } from 'recoil'
import { apiToken, validatorHealthResult, validatorNetworkError } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { useEffect } from 'react'
import { selectValidatorUrl } from '../recoil/selectors/selectValidatorUrl'
import { PollingOptions } from '../types'

const useValidatorHealthPolling = (options?: PollingOptions) => {
  const { time = 6000, isReady = true } = options || {}
  const validatorEndpoint = useRecoilValue(selectValidatorUrl)
  const url = `${validatorEndpoint}/ui/health`
  const token = useRecoilValue(apiToken)
  const setHealth = useSetRecoilState(validatorHealthResult)
  const setValidatorNetworkError = useSetRecoilState(validatorNetworkError)

  const setNetworkError = () => setValidatorNetworkError(true)

  const { data } = usePollApi({
    key: 'validatorHealth',
    time,
    isReady: !!token && isReady,
    apiToken: token,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setHealth(data?.data)
  }, [data])
}

export default useValidatorHealthPolling
