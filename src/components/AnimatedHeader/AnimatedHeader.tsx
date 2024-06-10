import { FC, useEffect } from 'react';
import useDivDimensions from "../../hooks/useDivDimensions";
import Topography, { TopographyCanvasProps } from '../Topography/Topography';

export interface AnimatedHeaderProps extends Omit<TopographyCanvasProps, 'height' | 'width'> {
  className: string
  isReady?: boolean
}

const AnimatedHeader:FC<AnimatedHeaderProps> = ({className, isReady, speed, name}) => {
  const { ref, dimensions, measure } = useDivDimensions()

  useEffect(() => {
    if(isReady) {
      measure()
    }
  }, [isReady, measure])

  return (
    <div ref={ref} className={className}>
      <div className="w-full h-full opacity-20 -translate-y-1/2">
        {dimensions?.width > 0 && (
          <Topography speed={speed} height={dimensions.height * 2} width={dimensions.width} name={name} animate/>
        )}
      </div>
    </div>
  )
}

export default AnimatedHeader