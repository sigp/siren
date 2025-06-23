import { FC, useEffect, useState } from 'react'
import { PlacesType } from 'react-tooltip'
import addClassString from '../../../utilities/addClassString'
import generateId from '../../../utilities/generateId'
import DarkNetwork from '../../assets/images/darkNetwork.svg'
import Network from '../../assets/images/network.svg'
import NotAvailable from '../../assets/images/notAvalilable.svg'
import { OptionalString, StatusColor } from '../../types'
import MetricLineChart from '../MetricLineChart/MetricLineChart'
import ProgressCircle from '../ProgressCircle/ProgressCircle'
import Status from '../Status/Status'
import Tooltip from '../ToolTip/Tooltip'
import Typography, { TypographyType } from '../Typography/Typography'

export type CardSize = 'lg' | 'md' | 'sm' | 'health'

export interface DiagnosticCardProps {
  status?: StatusColor
  percent?: number
  title: string
  metric?: string
  metricTextSize?: TypographyType
  subTitle: string
  border?: string
  subTitleHighlightColor?: string
  maxHeight?: OptionalString
  maxWidth?: OptionalString
  isBackground?: boolean
  size?: CardSize | undefined
  toolTipText?: OptionalString
  toolTipPosition?: PlacesType
  isDisabled?: boolean
  chartData?: number[]
  chartColor?: string
  chartLabel?: string
  isChartPercentage?: boolean
}

const DiagnosticCard: FC<DiagnosticCardProps> = ({
  title,
  metric,
  subTitle,
  status,
  maxHeight,
  maxWidth,
  metricTextSize,
  isBackground = true,
  border = 'border border-dark200',
  percent,
  size = 'md',
  subTitleHighlightColor,
  toolTipText,
  toolTipPosition,
  isDisabled,
  chartData,
  chartColor,
  chartLabel,
  isChartPercentage = true,
}) => {
  const [isReady, setReady] = useState(false)
  const toolTipId = Math.random().toString()
  const isSmall = size === 'sm'
  const getContainerSize = () => {
    switch (size) {
      case 'lg':
        return `${maxWidth || 'max-w-xs'} ${maxHeight || 'max-h-60'} py-3 px-4 dark:border-dark500`
      case 'sm':
        return `${maxWidth || 'max-w-tiny'} ${maxHeight || 'max-h-11'} p-1 dark:border-none px-1.5`
      case 'health':
        return `h-24 md:h-full ${
          maxWidth || 'max-w-full md:max-w-xs'
        } py-2 px-3 xl:py-3 xl:px-4 dark:border-dark500`
      default:
        return `${maxWidth || 'md:max-w-xs @1600:max-w-full'} ${
          maxHeight || 'max-h-30'
        } py-2 px-3 xl:py-3 xl:px-4 dark:border-dark500`
    }
  }

  useEffect(() => {
    setReady(true)
  }, [])

  const contentClass = addClassString('flex flex-col h-full', [isDisabled && 'opacity-20'])
  const renderContent = () => (
    <div className={contentClass}>
      {!metric && (
        <NotAvailable className='absolute opacity-60 w-20 text-dark100 dark:hidden right-0 top-1/2 transform -translate-y-1/2' />
      )}

      {/* Header with title and metric */}
      <div className='w-full z-10 space-x-8 flex justify-between flex-shrink-0'>
        <Typography
          type={isSmall ? 'text-tiny' : 'text-caption1'}
          className={!isSmall ? 'xl:text-body' : ''}
        >
          {title}
        </Typography>
        {metric && (
          <Typography
            type={isSmall ? 'text-tiny' : metricTextSize ? metricTextSize : 'text-caption1'}
            className={!isSmall && !metricTextSize ? 'xl:text-subtitle2' : ''}
          >
            {metric}
          </Typography>
        )}
      </div>

      {/* Status and subtitle above chart */}
      <div className='w-full capitalize z-10 space-x-8 flex items-center justify-between flex-shrink-0 mt-1'>
        <Typography
          type={isSmall ? 'text-tiny' : 'text-caption1'}
          color={subTitleHighlightColor ? 'text-dark900' : undefined}
          darkMode={subTitleHighlightColor ? 'dark:text-dark900' : undefined}
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

      {/* Chart fills remaining space at bottom */}
      {metric && size !== 'sm' && isBackground && chartData && chartColor && chartLabel && (
        <div className='w-full flex-1 min-h-0 mt-2 relative overflow-hidden rounded-md'>
          <div className='absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent opacity-50'></div>
          <MetricLineChart
            data={chartData}
            color={chartColor}
            label={chartLabel}
            animate={false}
            isPercentage={isChartPercentage}
            showYAxis={true}
          />
        </div>
      )}

      {/* Fallback background for non-chart cards */}
      {metric && size !== 'sm' && isBackground && (!chartData || !chartColor || !chartLabel) && (
        <div className='w-full max-h-full absolute left-0 top-1/2 transform -translate-y-1/2 overflow-hidden opacity-30'>
          <Network className='w-full dark:hidden' />
          <DarkNetwork className='w-full hidden dark:block' />
        </div>
      )}
    </div>
  )

  return (
    <div className={`w-full h-full ${getContainerSize()} ${border} relative`}>
      {toolTipText && isReady ? (
        <Tooltip
          className='h-full'
          maxWidth={250}
          id={toolTipId}
          place={toolTipPosition as PlacesType}
          text={toolTipText}
        >
          {renderContent()}
        </Tooltip>
      ) : (
        renderContent()
      )}
    </div>
  )
}

export default DiagnosticCard
