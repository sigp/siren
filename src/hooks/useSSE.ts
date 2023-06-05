import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'

interface UseSSEOptions {
  url?: string
  wait?: number
  callback: (event: MessageEvent) => void
  onError?: () => void
}

const useSSE = ({ url, wait = 0, callback, onError }: UseSSEOptions) => {
  const [eventSource, controller, errorCount] = [
    useRef<EventSource | null>(null),
    useRef<AbortController | null>(null),
    useRef<number>(0),
  ]

  useEffect(() => {
    if (!url) return

    eventSource.current = new EventSource(url)
    controller.current = new AbortController()

    eventSource.current.onmessage = throttle(callback, wait)
    eventSource.current.onerror = () => {
      if (errorCount.current++ >= 2) {
        controller.current?.abort()
        eventSource.current?.close()
        eventSource.current = null
        onError?.()
      }
    }

    return () => {
      eventSource.current?.close()
      eventSource.current = null
    }
  }, [url, wait, callback, onError])
}

export default useSSE
