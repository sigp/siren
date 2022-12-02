import { useEffect, useState } from 'react'

const useMediaQuery = (queryString: string) => {
  const [isMatch, setIsMatch] = useState(false)
  function mqChange(mq: MediaQueryList) {
    setIsMatch(mq.matches)
  }

  useEffect(() => {
    const mq = window.matchMedia(queryString)
    mq.addListener(mqChange as any)
    mqChange(mq)

    return () => {
      mq.removeListener(mqChange as any)
    }
  }, [])

  return isMatch
}

export default useMediaQuery
