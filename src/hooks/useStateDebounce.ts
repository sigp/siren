import { useEffect, useState } from 'react'

const useStateDebounce = <T>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default useStateDebounce
