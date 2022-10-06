import { FC } from 'react'
import Typography from '../Typography/Typography'
import ProgressCircle, { ProgressCircleProps } from '../ProgressCircle/ProgressCircle'
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency'
import Spinner from '../Spinner/Spinner';


export const SyncMetricFallback = () => {
  return (
    <div
      className="flex w-40 h-14 max-h-full bg-white flex items-center justify-center dark:bg-dark750 border border-borderLight dark:border-dark900"
    >
      <Spinner size="h-6 w-6"/>
    </div>
  )
}

export interface SyncMetricProps extends ProgressCircleProps {
  total: number
  amount: number
  subTitle: string,
  title: string
  borderStyle?: string
}

const SyncMetric: FC<SyncMetricProps> = ({
  title,
  amount,
  total,
  subTitle,
  borderStyle = 'border',
  percent,
  ...props
}) => {
  return (
    <div
      className={`flex w-40 h-14 max-h-full bg-white dark:bg-dark750 ${borderStyle} border-borderLight dark:border-dark900`}
    >
      <div className='p-1.5'>
        <Typography
          type='text-tiny'
          family='font-roboto'
          darkMode='dark:text-white'
          isBold
          className='uppercase mb-1.5'
        >
          {title}
        </Typography>
        <Typography
          type='text-caption2'
          family='font-roboto'
          color='text-dark400'
          fontWeight="font-light"
          className='uppercase'
        >
          {subTitle}
        </Typography>
        <Typography
          type='text-tiny'
          family='font-roboto'
          color='text-dark400'
          isBold
          className='uppercase'
        >
          {`${formatLocalCurrency(amount, { specificity: 0 })} / ${formatLocalCurrency(total, { specificity: 0 })}`}
        </Typography>
      </div>
      <div className='flex-1 flex items-center justify-center'>
        <ProgressCircle {...props} percent={percent || 0} />
      </div>
    </div>
  )
}

export default SyncMetric
