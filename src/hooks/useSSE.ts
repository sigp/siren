import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'

interface UseSSEOptions {
  url?: string
  wait?: number
  callback: (event: MessageEvent) => void
  onError?: () => void
}

const useSSE = (options: UseSSEOptions) => {
  const { url, wait = 0, callback, onError } = options
  const eventSourceRef = useRef<EventSource | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!url) return

    const eventSource = new EventSource(url)
    const controller = new AbortController()

    eventSource.onmessage = throttle(callback, wait)
    eventSource.onerror = () => {
      controller.abort()
      eventSource.close()
      eventSourceRef.current = null
      onError?.()
    }

    eventSourceRef.current = eventSource
    controllerRef.current = controller

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [url, wait, callback, onError])
}

export default useSSE
