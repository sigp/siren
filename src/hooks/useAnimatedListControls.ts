import { useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'

const useAnimatedListControls = (isActive: boolean) => {
  const controls = useAnimationControls()

  useEffect(() => {
    if (isActive) {
      controls.stop()
      const baseAnim = {
        y: 0,
        opacity: 100,
        transition: { duration: 0 },
      }
      controls.start((i) =>
        i < 100
          ? {
              ...baseAnim,
              transition: { duration: 0.2, delay: i * 0.1 },
            }
          : baseAnim,
      )
    }
  }, [isActive, controls])

  return { controls }
}

export default useAnimatedListControls
