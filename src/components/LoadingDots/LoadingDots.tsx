import { FC } from 'react'

export interface LoadingDotsProps {
  className?: string
}
const LoadingDots: FC<LoadingDotsProps> = ({ className }) => {
  const circleCommonClasses = 'h-2 w-2 bg-primary200 dark:bg-white rounded-full'

  return (
    <div data-testid='container' className={`${className ? `flex ${className}` : 'flex'}`}>
      <div data-testid='dot' className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div data-testid='dot' className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div data-testid='dot' className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  )
}

export default LoadingDots
