import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  apiToken,
  validatorClientEndpoint,
  validatorHealthResult,
  validatorHealthSyncInterval,
  validatorNetworkError,
} from '../recoil/atoms'
import usePollApi from './usePollApi'
import { useEffect } from 'react'
import formatHealthEndpoint from '../utilities/formatHealthEndpoint'

const useValidatorHealthPolling = (time = 6000) => {
  const validatorEndpoint = useRecoilValue(validatorClientEndpoint)
  const url = formatHealthEndpoint(validatorEndpoint)
  const token = useRecoilValue(apiToken)
  const setHealth = useSetRecoilState(validatorHealthResult)
  const setValidatorNetworkError = useSetRecoilState(validatorNetworkError)

  const setNetworkError = () => setValidatorNetworkError(true)

  const { response } = usePollApi({
    time,
    isReady: !!url && !!token,
    apiToken: token,
    intervalState: validatorHealthSyncInterval,
    url,
    onMaxError: setNetworkError,
  })

  useEffect(() => {
    setHealth(response?.data.data)
  }, [response])
}

export default useValidatorHealthPolling
