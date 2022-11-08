import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon';
import Typography from '../Typography/Typography';
import { FC } from 'react';

export interface ValidatorCardActionProps {
  icon: string
  title: string
  onClick?: () => void
}


const ValidatorCardAction:FC<ValidatorCardActionProps> = ({icon, title, onClick}) => {
  return (
    <div onClick={onClick} className="flex-1 border p-4 space-y-2">
      <ValidatorActionIcon icon={icon} color="text-primary"/>
      <div>
        <Typography>—</Typography>
        <Typography type="text-caption1" className="w-1/2">{title}</Typography>
      </div>
    </div>
  )
}

export default ValidatorCardAction;