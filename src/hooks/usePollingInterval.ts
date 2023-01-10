import { useEffect, useRef, useState } from 'react'

const usePollingInterval = (
  callback: () => void,
  delay: number,
  options?: { isSkip: boolean; onClearInterval?: () => void },
): { intervalId: NodeJS.Timer | undefined } => {
  const [intervalId, setId] = useState<NodeJS.Timer>()
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (intervalId) {
      return () => {
        options?.onClearInterval?.()
        clearInterval(intervalId)
        setId(undefined)
      }
    }
  }, [intervalId])

  useEffect(() => {
    if (options?.isSkip) return

    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      tick()
      const id = setInterval(tick, delay)
      setId(id)
    }
  }, [delay, options?.isSkip])

  return {
    intervalId,
  }
}

export default usePollingInterval
