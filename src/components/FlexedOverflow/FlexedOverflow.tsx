import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import addClassString from '../../../utilities/addClassString'
import Lighthouse from '../../assets/images/lightHouse.svg'

export interface FlexedOverflowProps {
  className?: string
  children: ReactNode | ReactNode[]
  isAutoScroll?: boolean
  onScrollBottom?: () => void
  isScrollAnim?: boolean
}

const FlexedOverflow: FC<FlexedOverflowProps> = ({
  children,
  className,
  isAutoScroll,
  onScrollBottom,
  isScrollAnim,
}) => {
  const container = useRef<HTMLDivElement>(null) // Explicitly typed ref
  const [scrollPercentage, setPercentage] = useState(0)
  const classes = addClassString('absolute top-0 left-0 w-full h-full overflow-scroll', [className])
  const animClasses = addClassString('h-12 w-full', [isScrollAnim ? 'opacity-100' : 'opacity-0'])

  const { scrollY } = useScroll({
    container,
  })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (container?.current) {
      const totalHeight = container.current.scrollHeight - container.current.clientHeight // Type-safe access
      setPercentage(Math.round((latest / totalHeight) * 100))
    }
  })

  useEffect(() => {
    if (scrollPercentage === 100 && onScrollBottom) {
      onScrollBottom()
    }
  }, [scrollPercentage])

  useEffect(() => {
    if (container.current && isAutoScroll) {
      container.current.scrollTo({
        top: container.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [children, isAutoScroll])

  return (
    <div className='flex-1 relative'>
      <div ref={container} className={classes}>
        {children}
        {!!onScrollBottom && (
          <div className={animClasses}>
            <motion.div
              className='opacity-20 w-fit absolute left-1/2 -translate-x-1/2 flex items-center justify-center'
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Lighthouse className='w-8 text-white' />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlexedOverflow
