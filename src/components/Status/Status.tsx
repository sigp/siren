import {FC} from "react";

export type StatusType = 'bg-success' | 'bg-warning' | 'bg-error';

export interface StatusProps {
  status: StatusType
  size?: string
}

const Status:FC<StatusProps> = ({status, size= 'h-5 w-5'}) => {
  return (
      <div className={`${size} ${status} flex-shrink-0 rounded-full border-2 dark:border-black border-white drop-shadow-lg`} />
  )
}

export default Status;