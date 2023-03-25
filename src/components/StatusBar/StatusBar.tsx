import { FC } from 'react'
import { StatusColor } from '../../types'

export interface StatusBarProps {
  count: 1 | 2 | 3
  status: StatusColor
}

const StatusBar: FC<StatusBarProps> = ({ count, status }) => {
  return (
    <div className='flex h-3 space-x-1'>
      {Array.from(Array(3).keys()).map((index) => (
        <div
          key={index}
          className={`h-full w-1.5 ${status} ${index + 1 > count ? 'opacity-0' : ''}`}
        />
      ))}
    </div>
  )
}

export default StatusBar
