import { ApiPollConfig } from '../types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import axios, { AxiosResponse } from 'axios'
import { DEFAULT_MAX_NETWORK_ERROR } from '../constants/constants'

const usePollApi = ({
  time,
  isReady,
  intervalState,
  url,
  apiToken,
  maxErrors = DEFAULT_MAX_NETWORK_ERROR,
  onMaxError,
  params,
  method = 'get',
  data,
}: ApiPollConfig) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>()
  const [errorMessage, setError] = useState<string | undefined>(undefined)
  const [errorCount, setErrorCount] = useState<number>(0)
  const [interval, setIntervalId] = useRecoilState(intervalState)
  const onClearInterval = () => setIntervalId(undefined)
  const isSkip = !isReady || !!interval

  const fetchApi = async () => {
    if (!url) return

    setError(undefined)

    try {
      const result = await axios({
        method,
        url,
        headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined,
        params,
        data,
      })

      if (result) {
        setError(undefined)
        setErrorCount(0)
        setResponse(result)
      }
    } catch (e) {
      if (e instanceof Error) {
        console?.error(e.message)
        setError(e.message)
        setErrorCount((prev) => prev + 1)
      }
    }
  }

  const { intervalId, clearPoll } = usePollingInterval(fetchApi, time, {
    isSkip,
    onClearInterval,
  })

  useEffect(() => {
    if (intervalId) {
      setIntervalId(intervalId)
    }
  }, [intervalId])

  useEffect(() => {
    if (isReady) {
      void fetchApi()
    }
  }, [isReady])

  useEffect(() => {
    if (maxErrors && errorCount >= maxErrors && intervalId) {
      onMaxError?.()
      clearPoll(intervalId)
    }
  }, [errorCount, maxErrors, onMaxError, intervalId])

  return {
    response,
    error: errorMessage,
    errorCount,
  }
}

export default usePollApi
