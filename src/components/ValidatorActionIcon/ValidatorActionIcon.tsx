import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { OptionalBoolean } from '../../types'
import LoadingDots from '../LoadingDots/LoadingDots'

export interface ValidatorActionIconProps {
  icon: string
  border?: string
  backgroundColor?: string
  color?: string
  size?: string
  onClick?: () => void
  isLoading?: OptionalBoolean
  isDisabled?: boolean
}

const ValidatorActionIcon: FC<ValidatorActionIconProps> = ({
  icon,
  size,
  backgroundColor = 'bg-dark25 dark:bg-dark750',
  border = 'border border-primary100 dark:border-primary',
  color = 'text-primary',
  isDisabled,
  isLoading,
  onClick,
}) => {
  const classes = addClassString(
    'w-8 h-8 cursor-pointer rounded-full flex items-center justify-center',
    [
      border,
      backgroundColor,
      isDisabled && 'opacity-20 pointer-events-none',
      isLoading && 'pointer-events-none',
    ],
  )

  return (
    <div onClick={onClick} className={classes}>
      {isLoading ? (
        <LoadingDots size={1} darkColor='dark:bg-primary200' />
      ) : (
        <i className={`${icon} ${color} ${size}`} />
      )}
    </div>
  )
}

export default ValidatorActionIcon
