import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { StatusColor } from '../../types'
import Status from '../Status/Status'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

export interface NetworkStatBlockProps {
  title: string
  metric: string
  subTitle?: string
  status?: StatusColor
  className?: string
  toolTipId?: string
  toolTipText?: string
  toolTipWidth?: number
  metricFontSize?: 'text-caption2' | 'text-subtitle3'
}

const NetworkStatBlock: FC<NetworkStatBlockProps> = ({
  title,
  subTitle,
  metric,
  className,
  metricFontSize = 'text-caption2',
  toolTipId,
  toolTipText,
  toolTipWidth = 150,
  status,
}) => {
  const isToolTip = toolTipId && toolTipText
  const classes = addClassString(
    'py-4 px-4 md:py-2 md:px-2 xl:px-4 flex flex-col justify-between h-full w-full space-y-6 md:space-y-0 border-b-style500 md:border-b-0 md:w-40 @1600:w-auto @1600:flex-1 md:border-r-style500',
    [className],
  )
  const renderContent = () => (
    <>
      <div className='flex space-x-2 items-center'>
        <Typography isUpperCase type='text-tiny' isBold darkMode='dark:text-white'>
          {title}
        </Typography>
        {isToolTip && (
          <i className='bi-info-circle text-caption1.5 text-dark400 dark:text-dark300' />
        )}
      </div>
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
    </>
  )
  return isToolTip ? (
    <Tooltip
      className={classes}
      id={toolTipId as string}
      maxWidth={toolTipWidth}
      text={toolTipText as string}
    >
      {renderContent()}
    </Tooltip>
  ) : (
    <div className={classes}>{renderContent()}</div>
  )
}

export default NetworkStatBlock
