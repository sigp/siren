import { FC } from 'react';

export interface ValidatorActionIconProps {
  icon: string
  border?: string
  backgroundColor?: string
  color?: string
  size?: string
}

const ValidatorActionIcon:FC<ValidatorActionIconProps> = ({icon, size, backgroundColor = 'bg-dark25 dark:bg-dark750', border = 'border border-primary100 dark:border-primary', color = 'text-primary'}) => {
  return (
    <div className={`${border} ${backgroundColor} w-8 h-8  cursor-pointer rounded-full flex items-center justify-center`}>
      <i className={`${icon} ${color} ${size}`} />
    </div>
  )
}

export default ValidatorActionIcon;