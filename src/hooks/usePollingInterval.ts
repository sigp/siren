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
    if (options?.isSkip) return

    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      setId(id)
      return () => {
        options?.onClearInterval?.()
        clearInterval(id)
        setId(undefined)
      }
    }
  }, [delay])

  return {
    intervalId,
  }
}

export default usePollingInterval
