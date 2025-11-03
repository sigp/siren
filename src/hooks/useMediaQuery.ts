import { useEffect, useState } from 'react'

const useMediaQuery = (queryString: string) => {
  const [isMatch, setIsMatch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(queryString)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMatch(event.matches)
    }

    // Set initial value
    setIsMatch(mq.matches)

    // Use addEventListener instead of deprecated addListener
    mq.addEventListener('change', handleChange)

    return () => {
      mq.removeEventListener('change', handleChange)
    }
  }, [queryString])

  return isMatch
}

export default useMediaQuery
