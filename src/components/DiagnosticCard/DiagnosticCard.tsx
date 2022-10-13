import { FC } from 'react'
import Typography from '../Typography/Typography'
import network from '../../assets/images/network.svg'
import { ReactComponent as NotAvailable } from '../../assets/images/notAvalilable.svg'
import darkNetwork from '../../assets/images/darkNetwork.svg'
import Status, { StatusType } from '../Status/Status'
import ProgressCircle from '../ProgressCircle/ProgressCircle'
import generateId from '../../utilities/generateId'

export interface DiagnosticCardProps {
  status?: StatusType
  percent?: number
  title: string
  metric?: string
  subTitle: string
  border?: string
  subTitleHighlightColor?: string
  maxHeight?: string
  isBackground?: boolean
  size?: 'lg' | 'md' | 'sm' | 'health'
}

const DiagnosticCard: FC<DiagnosticCardProps> = ({
  title,
  metric,
  subTitle,
  status,
  maxHeight,
  isBackground = true,
  border = 'border border-dark200',
  percent,
  size = 'md',
  subTitleHighlightColor,
}) => {
  const isSmall = size === 'sm'
  const getContainerSize = () => {
    switch (size) {
      case 'lg':
        return `max-w-xs ${maxHeight || 'max-h-60'} py-3 px-4 dark:border-dark500`
      case 'sm':
        return `max-w-tiny ${maxHeight || 'max-h-11'} p-1 dark:border-none px-1.5`
      case 'health':
        return 'h-24 md:h-full max-w-full md:max-w-xs py-2 px-3 xl:py-3 xl:px-4 dark:border-dark500'
      default:
        return `max-w-xs ${
          maxHeight || 'max-h-30'
        } py-2 px-3 xl:py-3 xl:px-4 dark:border-dark500 @1600:max-w-full`
    }
  }

  return (
    <div
      className={`w-full overflow-hidden h-full ${getContainerSize()} ${border} relative flex flex-col justify-between`}
    >
      {!metric ? (
        <NotAvailable className='absolute opacity-60 w-20 text-dark100 dark:hidden right-0 top-1/2 transform -translate-y-1/2' />
      ) : (
        size !== 'sm' &&
        isBackground && (
          <>
            <img
              className='w-full absolute dark:hidden left-0 top-1/2 transform -translate-y-1/2'
              src={network}
              alt='network'
            />
            <img
              className='w-full absolute hidden dark:block left-0 top-1/2 transform -translate-y-1/2'
              src={darkNetwork}
              alt='network'
            />
          </>
        )
      )}
      <div className='w-full z-10 space-x-8 flex justify-between'>
        <Typography
          type={isSmall ? 'text-tiny' : 'text-caption1'}
          className={!isSmall ? 'xl:text-body' : ''}
        >
          {title}
        </Typography>
        {metric && (
          <Typography
            type={isSmall ? 'text-tiny' : 'text-caption1'}
            className={!isSmall ? 'xl:text-subtitle2' : ''}
          >
            {metric}
          </Typography>
        )}
      </div>
      <div className='w-full capitalize z-10 space-x-8 flex items-center justify-between'>
        <Typography
          type={isSmall ? 'text-tiny' : 'text-caption1'}
          className={subTitleHighlightColor ? `${subTitleHighlightColor} px-1` : undefined}
        >
          {subTitle}
        </Typography>
        {percent ? (
          <ProgressCircle size='sm' id={generateId(12)} percent={percent} />
        ) : (
          status && <Status status={status} />
        )}
      </div>
    </div>
  )
}

export default DiagnosticCard
