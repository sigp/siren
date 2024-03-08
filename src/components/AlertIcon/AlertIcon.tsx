import React, { FC } from 'react';
import addClassString from '../../../utilities/addClassString';


export interface AlertIconProps {
  type: 'info' | 'warning' | 'error'
  className?: string
}

const AlertIcon:FC<AlertIconProps> = ({type, className = 'md:mr-14 h-12 w-12'}) => {
  const isWarning = type === 'warning'
  const isInfo = type === 'info'
  const isError = type === 'error'

  const warningIconBackgroundClasses = addClassString(
    'rounded-full flex-shrink-0 flex items-center justify-center',
    [isInfo && 'bg-dark400', isError && 'bg-lightError200', isWarning && 'bg-warning', className],
  )
  const warningIconClasses = addClassString('text-2xl', [
    isInfo && 'bi-hourglass-split text-dark600',
    isError && 'bi-exclamation-triangle-fill text-error',
    isWarning && 'bi-exclamation text-4xl text-warning900',
  ])

  return (
    <div className={warningIconBackgroundClasses}>
      <i className={warningIconClasses} />
    </div>
  )
}

export default AlertIcon