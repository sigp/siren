import { useEffect, useState, useRef, RefObject, useCallback } from 'react'

type Dimensions = {
  width: number
  height: number
}

const useDivDimensions = (): {
  ref: RefObject<HTMLDivElement>
  dimensions?: Dimensions
  measure: () => void
} => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions | undefined>(undefined)

  const measure = useCallback(() => {
    const refCurrent = ref.current
    if (refCurrent) {
      const { width, height } = refCurrent.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

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
    measure,
  }
}

export default useDivDimensions
