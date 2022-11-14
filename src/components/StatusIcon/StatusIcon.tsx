import { ReactComponent as CheckIcon } from '../../assets/images/check.svg';
import { ReactComponent as UnknownIcon } from '../../assets/images/unknown.svg';
import { ReactComponent as SlasherIcon } from '../../assets/images/slasher.svg';
import { ReactComponent as ExitIcon } from '../../assets/images/exit.svg';
import { FC } from 'react';
import { ValidatorStatus } from '../../types/validator';

export interface StatusIconProps {
  status: ValidatorStatus
}

const StatusIcon:FC<StatusIconProps> = ({status}) => {
  switch (status) {
    case 'active_ongoing':
      return <CheckIcon className='h-4 w-4 text-success' />
    case 'active_slashed':
      return (
        <div className='flex items-center space-x-2'>
          <SlasherIcon className='h-4 w-4 text-error' />
          <ExitIcon className='h-4 w-4 text-error' />
        </div>
      )
    default:
      return <UnknownIcon className='h-4 w-4 text-warning' />
  }
}

export default StatusIcon;