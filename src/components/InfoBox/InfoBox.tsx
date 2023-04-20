import addClassString from '../../utilities/addClassString'
import React, { FC, ReactNode } from 'react'
import Typography from '../Typography/Typography'

export enum InfoBoxType {
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export interface InfoBoxProps {
  type: InfoBoxType
  children?: ReactNode | ReactNode[]
  text?: string
}

const InfoBox: FC<InfoBoxProps> = ({ type, children, text }) => {
  const isWarning = type === InfoBoxType.WARNING
  const isInfo = type === InfoBoxType.INFO

  const warningClasses = addClassString('w-full flex items-center p-6 rounded', [
    isInfo && 'bg-dark500',
    isWarning && 'bg-lightError',
  ])
  const warningIconBackgroundClasses = addClassString(
    'rounded-full mr-14 flex-shrink-0 flex items-center justify-center h-12 w-12',
    [isInfo && 'bg-dark400', isWarning && 'bg-lightError200'],
  )
  const warningIconClasses = addClassString('text-2xl', [
    isInfo && 'bi-hourglass-split text-dark600',
    isWarning && 'bi-exclamation-triangle-fill text-error',
  ])

  return (
    <div className={warningClasses}>
      <div className={warningIconBackgroundClasses}>
        <i className={warningIconClasses} />
      </div>
      {children ? (
        children
      ) : text ? (
        <Typography type='text-caption1' darkMode='text-dark900'>
          {text}
        </Typography>
      ) : null}
    </div>
  )
}

export default InfoBox
