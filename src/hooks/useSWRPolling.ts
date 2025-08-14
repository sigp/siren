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
): { data: T } => {
  const { refreshInterval = 12000, fallbackData, errorRetryCount = 2, networkError } = config || {}
  const [errorCount, setErrors] = useState(0)

  const incrementCount = () => {
    // Handle infinite retries for network monitoring
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

  // Reset error count on successful data fetch
  const onSuccess = (data: T) => {
    if (errorCount > 0) {
      setErrors(0)
    }
    return data
  }

  const { data } = useSWR<T>(
    [errorCount <= errorRetryCount && !networkError ? api : null],
    swrGetFetcher,
    {
      refreshInterval,
      fallbackData,
      errorRetryCount: errorRetryCount === Infinity ? 0 : errorRetryCount, // Let SWR handle finite retries
      onError: incrementCount,
      onSuccess,
      shouldRetryOnError: true,
      errorRetryInterval: refreshInterval, // Retry at the same interval as refresh
    },
  )

  return { data: data as T }
}

export default useSWRPolling
