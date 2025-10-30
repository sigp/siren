import { useState } from 'react'
import useSWR from 'swr'
import swrGetFetcher from '../../utilities/swrGetFetcher'

const useSWRPolling = <T = any>(
  api: string | null,
  config?: {
    refreshInterval?: number
    fallbackData?: any
    errorRetryCount?: number
    networkError?: boolean
  },
  callBack?: (url: string | null) => void,
): { data: T; error: any; lastSuccessTime: number | null } => {
  const { refreshInterval = 12000, fallbackData, errorRetryCount = 2, networkError } = config || {}
  const [errorCount, setErrors] = useState(0)
  const [lastSuccessTime, setLastSuccessTime] = useState<number | null>(null)

  const incrementCount = () => {
    if (errorRetryCount === Infinity) {
      callBack?.(api)
      return
    }

    if (errorCount < errorRetryCount) {
      setErrors((prev) => prev + 1)
      return
    }

    callBack?.(api)
  }

  const onSuccess = (data: T) => {
    setLastSuccessTime(Date.now())
    if (errorCount > 0) {
      setErrors(0)
    }
    return data
  }

  // For infinite retry (heartbeat monitoring), always poll
  // For limited retry, stop after max errors or when networkError flag is set
  const shouldFetch =
    errorRetryCount === Infinity ? api : errorCount <= errorRetryCount && !networkError ? api : null

  const { data, error } = useSWR<T>(shouldFetch, swrGetFetcher, {
    refreshInterval,
    fallbackData,
    onError: incrementCount,
    onSuccess,
    shouldRetryOnError: errorRetryCount === Infinity,
    errorRetryCount: errorRetryCount === Infinity ? Infinity : errorRetryCount,
    errorRetryInterval: refreshInterval,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // Removed dedupingInterval: 0 and keepPreviousData: false
    // to allow global SWRConfig settings to enable caching
  })

  return { data: data as T, error, lastSuccessTime }
}

export default useSWRPolling
