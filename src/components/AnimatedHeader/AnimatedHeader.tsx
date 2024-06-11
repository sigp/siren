import { FC, useEffect } from 'react';
import useDivDimensions from "../../hooks/useDivDimensions";
import Topography, { TopographyCanvasProps } from '../Topography/Topography';

export interface AnimatedHeaderProps extends Omit<TopographyCanvasProps, 'height' | 'width'> {
  className: string
  isReady?: boolean | undefined
}

const AnimatedHeader:FC<AnimatedHeaderProps> = ({className, isReady, speed, name, animate = true}) => {
  const { ref, dimensions, measure } = useDivDimensions()

  useEffect(() => {
    if(isReady) {
      measure()
    }
  }, [isReady, measure])

  const validDimensions = (dimensions?.width || 0) > 0 && (dimensions?.height || 0) > 0;

  return (
    <div ref={ref} className={className}>
      <div className="w-full h-full opacity-20 -translate-y-1/2">
        {dimensions && validDimensions && (
          <Topography speed={speed} height={dimensions.height * 2} width={dimensions.width} name={name} animate={animate}/>
        )}
      </div>
    </div>
  )
}

export default AnimatedHeader