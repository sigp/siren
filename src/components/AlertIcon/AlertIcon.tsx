import React, { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { InfoBoxProps, InfoBoxType } from '../InfoBox/InfoBox'

export interface AlertIconProps extends Pick<InfoBoxProps, 'type'> {
  className?: string
}

const AlertIcon: FC<AlertIconProps> = ({ type, className = 'h-12 w-12' }) => {
  const isWarning = type === InfoBoxType.WARNING
  const isInfo = type === InfoBoxType.INFO
  const isError = type === InfoBoxType.ERROR
  const isNotice = type === InfoBoxType.NOTICE

  const warningIconBackgroundClasses = addClassString(
    'rounded-full flex-shrink-0 flex items-center justify-center md:mr-8',
    [
      isInfo && 'bg-dark200 dark:bg-dark400',
      isError && 'bg-lightError200',
      isWarning && 'bg-warning',
      isNotice && 'bg-primary100 dark:bg-primary_05',
      className,
    ],
  )
  const warningIconClasses = addClassString('text-2xl', [
    isInfo && 'bi-hourglass-split text-dark600',
    isError && 'bi-exclamation-triangle-fill text-error',
    isWarning && 'bi-exclamation text-4xl text-warning900',
    isNotice && 'bi-exclamation-triangle-fill text-4xl text-primary',
  ])

  return (
    <div className={warningIconBackgroundClasses}>
      <i className={warningIconClasses} />
    </div>
  )
}

export default AlertIcon
