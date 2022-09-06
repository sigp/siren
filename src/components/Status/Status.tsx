import {FC} from "react";

export type StatusType = 'bg-success' | 'bg-warning' | 'bg-error';

export interface StatusProps {
  status: StatusType
}

const Status:FC<StatusProps> = ({status}) => {
  return (
      <div className={`h-5 w-5 ${status} rounded-full border-2 dark:border-black border-white drop-shadow-lg`} />
  )
}

export default Status;