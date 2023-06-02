import { useCallback, useEffect, useState } from 'react'
import axios, { Method } from 'axios'
import { useQuery } from 'react-query'

const usePollApi = ({
  key,
  url,
  time,
  method,
  apiToken,
  params,
  payload,
  onMaxError,
  maxErrors = 3,
  isReady = true,
}: {
  key: string
  time: number
  isReady?: boolean
  url?: string
  apiToken?: string
  maxErrors?: number
  onMaxError?: () => void
  params?: { [key: string]: any }
  payload?: { [key: string]: any }
  method?: Method
}) => {
  const [retries, setRetries] = useState(0)

  const fetchApi = useCallback(async () => {
    if (!url) return

    const { data } = await axios({
      method,
      url,
      headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined,
      params,
      data: payload,
    })

    return data
  }, [url, method, apiToken, params, payload])

  const { data } = useQuery(key, fetchApi, {
    enabled: isReady,
    refetchInterval: retries < maxErrors ? time : false,
    retry: 3,
    onError: () => {
      setRetries((retries) => retries + 1)
    },
  })

  useEffect(() => {
    if (retries >= maxErrors) {
      onMaxError?.()
    }
  }, [retries, maxErrors])

  return {
    data,
  }
}

export default usePollApi
