import { FC } from 'react'

export interface LoadingDotsProps {
  className?: string
  size?: number
  color?: string
  darkColor?: string
}
const LoadingDots: FC<LoadingDotsProps> = ({
  className,
  size = 2,
  color = 'bg-primary200',
  darkColor = 'dark:bg-white',
}) => {
  const circleCommonClasses = `h-${size} w-${size} ${color} ${darkColor} rounded-full`

  return (
    <div data-testid='container' className={`${className ? `flex ${className}` : 'flex'}`}>
      <div data-testid='dot' className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div data-testid='dot' className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div data-testid='dot' className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  )
}

export default LoadingDots
