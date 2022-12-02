import { ApiPollConfig } from '../types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import axios, { AxiosResponse } from 'axios'

const usePollApi = ({ time, isReady, intervalState, url, apiToken }: ApiPollConfig) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>()
  const [interval, setIntervalId] = useRecoilState(intervalState)
  const onClearInterval = () => setIntervalId(undefined)
  const isSkip = !isReady || !!interval

  const fetchApi = async () => {
    if (!url) return

    const result = await axios.get(
      url,
      apiToken
        ? {
            headers: { Authorization: `Bearer ${apiToken}` },
          }
        : undefined,
    )

    setResponse(result)
  }

  const { intervalId } = usePollingInterval(fetchApi, time, {
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

  return {
    response,
  }
}

export default usePollApi
