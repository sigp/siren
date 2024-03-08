import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import Typography from '../Typography/Typography'
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'

export interface ValidatorCardActionProps {
  className?: string
  icon: string
  title: string
  onClick?: () => void
  isDisabled?: boolean
}

const ValidatorCardAction: FC<ValidatorCardActionProps> = ({
  icon,
  title,
  onClick,
  isDisabled,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={addClassString('border p-4 space-y-2 cursor-pointer', [
        className,
        isDisabled && 'opacity-20 pointer-events-none',
      ])}
    >
      <ValidatorActionIcon icon={icon} color='text-primary' />
      <div>
        <Typography>—</Typography>
        <Typography type='text-caption1' className='w-1/2'>
          {title}
        </Typography>
      </div>
    </div>
  )
}

export default ValidatorCardAction
