import { StatusType } from '../types';

const formatAtHeadSlotStatus = (status?: number): StatusType | 'bg-dark100' => {
  if(status === undefined) return 'bg-dark100'

  switch (true) {
    case status >= -1:
      return 'bg-success'
    case status < -2 && status > -5:
      return 'bg-warning'
    case status < -5:
      return 'bg-error'
    default:
      return 'bg-dark100'
  }
}

export default formatAtHeadSlotStatus;