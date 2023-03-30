import { useEffect, useRef, useState } from 'react'
import { PollingInterval, PollingIntervalOptions } from '../types'

const usePollingInterval = (
  callback: () => void,
  delay: number,
  options?: PollingIntervalOptions,
): PollingInterval => {
  const [intervalId, setId] = useState<NodeJS.Timer>()
  const savedCallback = useRef<() => void>()
  const isSkip = options?.isSkip

  const clearPoll = (id: NodeJS.Timer) => {
    options?.onClearInterval?.()
    clearInterval(id)
    setId(undefined)
  }

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (intervalId || isSkip) return

    function tick() {
      savedCallback.current?.()
    }

    const id = setInterval(tick, delay)
    setId(id)
  }, [delay, intervalId, isSkip])

  useEffect(() => {
    if (intervalId) {
      return () => {
        clearPoll(intervalId)
      }
    }
  }, [intervalId])

  return {
    intervalId,
    clearPoll,
  }
}

export default usePollingInterval
