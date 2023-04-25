import { ReactComponent as CheckIcon } from '../../assets/images/check.svg'
import { ReactComponent as UnknownIcon } from '../../assets/images/unknown.svg'
import { ReactComponent as SlasherIcon } from '../../assets/images/slasher.svg'
import { FC } from 'react'
import { ValidatorStatus } from '../../types/validator'

export interface StatusIconProps {
  status: ValidatorStatus
}

const StatusIcon: FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'pending':
    case 'pending_initialized':
    case 'pending_queued':
      return <i className='bi bi-clock text-dark400 dark:text-dark300' />
    case 'active_ongoing':
    case 'active':
      return <CheckIcon className='h-4 w-4 text-success' />
    case 'active_exiting':
      return <i className='bi bi-arrow-bar-right text-success' />
    case 'exited_unslashed':
    case 'exited':
      return <i className='bi text-dark400 dark:text-dark300 bi-box-arrow-right' />
    case 'exited_slashed':
      return (
        <div className='flex items-center space-x-2'>
          <i className='bi text-dark400 dark:text-dark300 bi-box-arrow-right' />
          <SlasherIcon className='h-4 w-4 text-error' />
        </div>
      )
    case 'withdrawal':
    case 'withdrawal_possible':
      return <i className='bi bi-send text-dark400 dark:text-dark300' />
    case 'withdrawal_done':
      return <i className='bi bi-send-check text-success' />
    case 'active_slashed':
      return (
        <div className='flex items-center space-x-2'>
          <CheckIcon className='h-4 w-4 text-success' />
          <SlasherIcon className='h-4 w-4 text-error' />
        </div>
      )
    default:
      return <UnknownIcon className='h-4 w-4 text-warning' />
  }
}

export default StatusIcon
