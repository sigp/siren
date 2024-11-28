import { motion, useAnimationControls } from 'framer-motion'
import React, { FC, ReactNode, useEffect } from 'react'
import addClassString from '../../../utilities/addClassString'
import AlertIcon from '../AlertIcon/AlertIcon'
import Typography from '../Typography/Typography'

export enum InfoBoxType {
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export interface InfoBoxProps {
  type: InfoBoxType
  children?: ReactNode | ReactNode[]
  text?: string
  isActive?: boolean
  animDelay?: number
  className?: string
}

const InfoBox: FC<InfoBoxProps> = ({
  type,
  children,
  text,
  isActive = true,
  animDelay,
  className,
}) => {
  const isWarning = type === InfoBoxType.WARNING
  const isInfo = type === InfoBoxType.INFO
  const isError = type === InfoBoxType.ERROR
  const isNotice = type === InfoBoxType.NOTICE

  const controls = useAnimationControls()

  useEffect(() => {
    if (isActive) {
      controls.start({
        scale: 1,
      })
    }
  }, [isActive, controls])

  const warningClasses = addClassString(
    'w-full flex flex-col md:flex-row space-y-4 md:space-y-0 items-center p-6 rounded',
    [
      isInfo && 'bg-dark100 dark:bg-dark500',
      isError && 'bg-lightError',
      isWarning && 'bg-warning200',
      isNotice && 'bg-primary100 dark:bg-primaryF2',
      className,
    ],
  )

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={controls}
      transition={{ delay: animDelay }}
      className={warningClasses}
    >
      <AlertIcon className={isNotice ? 'h-16 w-16' : 'h-12 w-12'} type={type} />
      {children ? (
        children
      ) : text ? (
        <Typography type='text-caption1' darkMode='text-dark900'>
          {text}
        </Typography>
      ) : null}
    </motion.div>
  )
}

export default InfoBox
