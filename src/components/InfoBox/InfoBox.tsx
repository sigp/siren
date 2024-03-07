import React, { FC, ReactNode } from 'react'
import addClassString from '../../../utilities/addClassString'
import AlertIcon from '../AlertIcon/AlertIcon';
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

  return (
    <div className={warningClasses}>
      <AlertIcon type={type.toLowerCase() as any}/>
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
