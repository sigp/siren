import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import Typography from '../Typography/Typography'
import { FC } from 'react'

export interface ValidatorCardActionProps {
  className?: string
  icon: string
  title: string
  onClick?: () => void
}

const ValidatorCardAction: FC<ValidatorCardActionProps> = ({
  icon,
  title,
  onClick,
  className = 'w-32 @425:w-36 sm:w-96 mr-3 mb-2 lg:flex-1',
}) => {
  return (
    <div onClick={onClick} className={`border p-4 space-y-2 ${className}`}>
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
