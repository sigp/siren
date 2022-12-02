import Typography from '../Typography/Typography'
import ProgressCircle from '../ProgressCircle/ProgressCircle'
import { FC } from 'react'
import { ReactComponent as EthOutline } from '../../assets/images/eth-outline.svg'
import { ReactComponent as NotAvailable } from '../../assets/images/notAvalilable.svg'
import { ReactComponent as LightEth } from '../../assets/images/lightEth.svg'

export interface SyncCardProps {
  title: string
  subTitle: string
  timeRemaining: string
  progress: number
  status: string
  type?: 'beacon' | 'geth'
}

const SyncCard: FC<SyncCardProps> = ({
  title,
  subTitle,
  timeRemaining,
  status,
  progress,
  type,
}) => {
  return (
    <div className='flex-1 space-y-6 border border-dark100 p-4'>
      <div className='w-full flex justify-between'>
        <div>
          <Typography>{title}</Typography>
          <Typography>{subTitle}</Typography>
        </div>
        <Typography>{timeRemaining}</Typography>
      </div>
      <div className='relative w-full flex items-center justify-center'>
        <ProgressCircle percent={progress} size='xl' id='geth' />
        <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          {type === 'beacon' ? (
            <LightEth className='h-24 text-dark100' />
          ) : type === 'geth' ? (
            <EthOutline className='h-24 text-dark100' />
          ) : (
            <NotAvailable className='h-16 text-dark100' />
          )}
        </div>
      </div>
      <Typography type='text-subtitle2'>{status}</Typography>
    </div>
  )
}

export default SyncCard
