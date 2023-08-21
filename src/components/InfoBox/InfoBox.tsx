import addClassString from '../../utilities/addClassString'
import React, { FC, ReactNode } from 'react'
import Typography from '../Typography/Typography'

export enum InfoBoxType {
  WARNING = 'WARNING',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export interface InfoBoxProps {
  type: InfoBoxType
  children?: ReactNode | ReactNode[]
  text?: string
}

const InfoBox: FC<InfoBoxProps> = ({ type, children, text }) => {
  const isWarning = type === InfoBoxType.WARNING
  const isInfo = type === InfoBoxType.INFO
  const isError = type === InfoBoxType.ERROR

  const warningClasses = addClassString(
    'w-full flex flex-col md:flex-row space-y-4 md:space-y-0 items-center p-6 rounded',
    [isInfo && 'bg-dark500', isError && 'bg-lightError', isWarning && 'bg-warning200'],
  )
  const warningIconBackgroundClasses = addClassString(
    'rounded-full md:mr-14 flex-shrink-0 flex items-center justify-center h-12 w-12',
    [isInfo && 'bg-dark400', isError && 'bg-lightError200', isWarning && 'bg-warning'],
  )
  const warningIconClasses = addClassString('text-2xl', [
    isInfo && 'bi-hourglass-split text-dark600',
    isError && 'bi-exclamation-triangle-fill text-error',
    isWarning && 'bi-exclamation text-4xl text-warning900',
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
