import { useEffect, useRef, useState } from 'react'

const usePollingInterval = (
  callback: () => void,
  delay: number,
  options?: { isSkip: boolean; onClearInterval?: () => void },
): { intervalId: NodeJS.Timer | undefined; clearPoll: (id: NodeJS.Timer) => void } => {
  const [intervalId, setId] = useState<NodeJS.Timer>()
  const savedCallback = useRef<() => void>()

  const clearPoll = (id: NodeJS.Timer) => {
    options?.onClearInterval?.()
    clearInterval(id)
    setId(undefined)
  }

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (options?.isSkip) return

    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      setId(id)
      return () => {
        clearPoll(id)
      }
    }
  }, [delay])

  return {
    intervalId,
    clearPoll,
  }
}

export default usePollingInterval
