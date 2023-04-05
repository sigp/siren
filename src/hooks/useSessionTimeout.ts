import { useEffect, useRef, useState } from 'react'

const useSessionTimeout = (delay: number) => {
  const [timeoutId, setTimeoutId] = useState<number | null>(null)
  const [hasExpired, setHasExpired] = useState(false)
  const timeoutIdRef = useRef<number | null>(null)

  useEffect(() => {
    function clear() {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
        setTimeoutId(null)
      }
    }

    function reset() {
      clear()
      if (hasExpired) return
      const newTimeoutId = window.setTimeout(() => {
        setHasExpired(true)
        setTimeoutId(null)
      }, delay)
      timeoutIdRef.current = newTimeoutId
      setTimeoutId(newTimeoutId)
    }

    reset()

    const handleMouseMove = reset
    const handleKeyDown = reset

    function removeListeners() {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }

    if (hasExpired) {
      removeListeners()
    } else {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      clear()
      removeListeners()
    }
  }, [delay, hasExpired])

  return { timeoutId, hasExpired }
}

export default useSessionTimeout
