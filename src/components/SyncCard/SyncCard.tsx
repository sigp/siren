import Typography from '../Typography/Typography'
import ProgressCircle from '../ProgressCircle/ProgressCircle'
import { FC } from 'react'

export interface SyncCardProps {
  title: string
  subTitle: string
  timeRemaining: string
  progress: number
  status: string
}

const SyncCard: FC<SyncCardProps> = ({ title, subTitle, timeRemaining, status, progress }) => {
  return (
    <div className='flex-1 space-y-6 border border-dark100 p-4'>
      <div className='w-full flex justify-between'>
        <div>
          <Typography>{title}</Typography>
          <Typography>{subTitle}</Typography>
        </div>
        <Typography>{timeRemaining}</Typography>
      </div>
      <div className='w-full flex items-center justify-center'>
        <ProgressCircle percent={progress} size='xl' id='geth' />
      </div>
      <Typography type='text-subtitle2'>{status}</Typography>
    </div>
  )
}

export default SyncCard
