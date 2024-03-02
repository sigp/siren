import { useEffect, useState, useRef, RefObject } from 'react'

type Dimensions = {
  width: number
  height: number
}

const useDivDimensions = (): { ref: RefObject<HTMLDivElement>; dimensions?: Dimensions } => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions | undefined>(undefined)

  useEffect(() => {
    const handleResize = () => {
      const refCurrent = ref.current
      if (refCurrent) {
        const { width, height } = refCurrent.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    ref,
    dimensions,
  }
}

export default useDivDimensions
