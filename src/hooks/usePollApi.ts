import { ApiPollConfig } from '../types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import axios, { AxiosResponse } from 'axios'

const usePollApi = ({
  time,
  isReady,
  intervalState,
  url,
  apiToken,
  maxErrors = 4,
  onMaxError,
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
      const result = await axios.get(
        url,
        apiToken
          ? {
              headers: { Authorization: `Bearer ${apiToken}` },
            }
          : undefined,
      )

      if (result) {
        setError(undefined)
        setErrorCount(0)
        setResponse(result)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
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
