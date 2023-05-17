import { useEffect, useRef } from 'react'
import { throttle } from 'lodash'

interface UseSSEOptions {
  url?: string
  wait?: number
  callback: (event: MessageEvent) => void
}

const useSSE = (options: UseSSEOptions) => {
  const { url, wait = 0, callback } = options
  const eventSourceRef = useRef<EventSource | undefined>(undefined)

  useEffect(() => {
    if (!url) return

    if (!eventSourceRef.current) {
      eventSourceRef.current = new EventSource(url)
    }

    const eventSource = eventSourceRef.current

    eventSource.onmessage = throttle(callback, wait)

    return () => {
      eventSource.close()
      eventSourceRef.current = undefined
    }
  }, [url, wait, callback])
}

export default useSSE
