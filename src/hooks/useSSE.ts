import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'

interface UseSSEOptions {
  url?: string
  wait?: number
  callback: (event: MessageEvent) => void
  onError?: () => void
}

const useSSE = ({ url, wait = 0, callback, onError }: UseSSEOptions): void => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const errorCountRef = useRef<number>(0)

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()
    controllerRef.current = controller

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    const throttledCallback = throttle(callback, wait)
    eventSource.onmessage = (event) => throttledCallback(event)

    eventSource.onerror = () => {
      if (errorCountRef.current++ >= 2) {
        controller.abort()
        eventSource.close()
        eventSourceRef.current = null
        onError?.()
      }
    }

    eventSource.onopen = () => {
      errorCountRef.current = 0
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
      controllerRef.current = null
    }
  }, [url, wait, callback, onError])
}

export default useSSE
