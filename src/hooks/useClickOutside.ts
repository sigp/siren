import { RefObject, useEffect, useRef } from 'react'

const useClickOutside = <T extends HTMLElement>(
  handler: (event: MouseEvent) => void,
  excludeRef?: RefObject<HTMLElement>,
) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const listener = (event: any) => {
      const isRefContainsTarget = !ref.current || ref.current.contains(event.target)
      const isExcludeRefContainsTarget =
        excludeRef && (!excludeRef?.current || excludeRef.current.contains(event.target))

      if (isRefContainsTarget || isExcludeRefContainsTarget) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])

  return {
    ref,
  }
}

export default useClickOutside
