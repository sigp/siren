import Typography from '../Typography/Typography'
import { FC } from 'react'
import Status, { StatusType } from '../Status/Status'

export interface NetworkStatBlockProps {
  title: string
  metric: string
  subTitle?: string
  status?: StatusType
  className?: string
  metricFontSize?: 'text-caption2' | 'text-subtitle3'
}

const NetworkStatBlock: FC<NetworkStatBlockProps> = ({
  title,
  subTitle,
  metric,
  className,
  metricFontSize = 'text-caption2',
  status,
}) => {
  return (
    <div
      className={`${className} py-4 px-4 md:py-2 md:px-2 xl:px-4 h-full flex flex-col justify-between w-full space-y-6 md:space-y-0 border-b-style500 md:border-b-0 md:w-40 @1600:w-auto @1600:flex-1 md:border-r-style500`}
    >
      <Typography type='text-tiny' className='uppercase' isBold darkMode='dark:text-white'>
        {title}
      </Typography>
      <div
        className={`flex items-center justify-between md:justify-start md:space-x-4 ${
          status ? 'justify-between' : ''
        }`}
      >
        {status ? (
          <Status size='h-4 w-4' status={status} />
        ) : (
          <Typography color='text-dark300' type='text-caption2'>
            {subTitle}
          </Typography>
        )}
        <Typography isBold darkMode='dark:text-white' type={metricFontSize}>
          {metric}
        </Typography>
      </div>
    </div>
  )
}

export default NetworkStatBlock
