import axios from 'axios';
import Cookies from 'js-cookie';
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
): {data: T, refreshData: (nextUrl?: string) => Promise<void>, isLoading: boolean} => {
  const apiToken = Cookies.get('session-token')
  const { refreshInterval = 12000, fallbackData, errorRetryCount = 2, networkError } = config || {}
  const [errorCount, setErrors] = useState(0)

  const incrementCount = () => {
    if (errorCount < errorRetryCount) {
      setErrors((prev) => prev + 1)
      return
    }

    callBack?.(api)
  }

  const { data, mutate, isLoading } = useSWR<T>([errorCount <= errorRetryCount && !networkError ? api : null, apiToken], swrGetFetcher, {
    refreshInterval,
    fallbackData,
    errorRetryCount,
    onError: incrementCount,
  })

  const refreshData = async (nextUrl?: string) => {
    const { data } = await axios.get((nextUrl || api) as string, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    await mutate(data, {revalidate: false})
  }

  return {data: data as T, refreshData, isLoading}
}

export default useSWRPolling
