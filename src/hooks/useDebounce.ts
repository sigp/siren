import { useCallback, useRef } from 'react'

export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay],
  )
}

export default useDebounce
