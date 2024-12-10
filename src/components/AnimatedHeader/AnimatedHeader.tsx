import { FC, useEffect } from 'react'
import { UiMode } from '../../constants/enums'
import useDivDimensions from '../../hooks/useDivDimensions'
import useUiMode from '../../hooks/useUiMode'
import Topography, { TopographyCanvasProps } from '../Topography/Topography'

export interface AnimatedHeaderProps extends Omit<TopographyCanvasProps, 'height' | 'width'> {
  className: string
  isReady?: boolean | undefined
}

const AnimatedHeader: FC<AnimatedHeaderProps> = ({
  className,
  isReady,
  speed,
  name,
  color,
  animate = true,
}) => {
  const { ref, dimensions, measure } = useDivDimensions()
  const { mode } = useUiMode()

  useEffect(() => {
    if (isReady) {
      measure()
    }
  }, [isReady, measure])

  const validDimensions = (dimensions?.width || 0) > 0 && (dimensions?.height || 0) > 0
  const fallbackColor = mode === UiMode.DARK ? '#ffffff' : '#A9A9A9'

  return (
    <div ref={ref} className={className}>
      <div className='w-full h-full opacity-20 -translate-y-1/2'>
        {dimensions && validDimensions && (
          <Topography
            speed={speed}
            height={dimensions.height * 2}
            width={dimensions.width}
            color={color || fallbackColor}
            name={name}
            animate={animate}
          />
        )}
      </div>
    </div>
  )
}

export default AnimatedHeader
