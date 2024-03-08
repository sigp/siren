import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import ProgressCircle, { ProgressCircleProps } from '../ProgressCircle/ProgressCircle'
import Spinner from '../Spinner/Spinner'
import Typography from '../Typography/Typography'

export const SyncMetricFallback = () => {
  return (
    <div className='flex w-40 h-14 max-h-full bg-white flex items-center justify-center dark:bg-dark750 border border-borderLight dark:border-dark900'>
      <Spinner size='h-6 w-6' />
    </div>
  )
}

export interface SyncMetricProps extends ProgressCircleProps {
  total: number
  amount: number
  subTitle: string
  title: string
  borderStyle?: string
  className?: string
}

const SyncMetric: FC<SyncMetricProps> = ({
  title,
  amount,
  total,
  subTitle,
  borderStyle = 'border',
  percent,
  className,
  ...props
}) => {
  const classes = addClassString(
    'flex max-h-full bg-white dark:bg-dark750 border-borderLight dark:border-dark900',
    [borderStyle, className],
  )
  return (
    <div className={classes}>
      <div className='p-1.5'>
        <Typography
          type='text-tiny'
          family='font-roboto'
          darkMode='dark:text-white'
          isBold
          isUpperCase
          className='mb-1.5'
        >
          {title}
        </Typography>
        <Typography
          type='text-caption2'
          family='font-roboto'
          color='text-dark400'
          fontWeight='font-light'
          isUpperCase
        >
          {subTitle}
        </Typography>
        <Typography type='text-tiny' family='font-roboto' color='text-dark400' isBold isUpperCase>
          {`${formatLocalCurrency(amount, { isStrict: true })} / ${formatLocalCurrency(total, {
            isStrict: true,
          })}`}
        </Typography>
      </div>
      <div className='hidden md:flex flex-1 ml-4 mr-2 items-center justify-center'>
        <ProgressCircle {...props} percent={percent || 0} />
      </div>
    </div>
  )
}

export default SyncMetric
