import { FC, ReactNode, useEffect, useState } from 'react'
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
  subTitle: string | ReactNode
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
  iconType?: 'cpu' | 'ram' | 'disk' | 'critical' | 'error' | 'warning' | 'network' | 'beacon'
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
  iconType,
}) => {
  const [isReady, setReady] = useState(false)
  const toolTipId = Math.random().toString()
  const isSmall = size === 'sm'
  const getContainerSize = () => {
    switch (size) {
      case 'lg':
        return `${maxWidth || 'max-w-xs'} ${maxHeight || 'max-h-60'} py-3 px-4 dark:border-dark500`
      case 'sm':
        return `${maxWidth || 'w-fit min-w-32 max-w-40'} ${maxHeight || 'max-h-11'} p-1 dark:border-none px-1.5`
      case 'health':
        return `h-24 md:h-full ${
          maxWidth || 'max-w-full md:max-w-xs'
        } py-1 px-2 xl:py-2 xl:px-3 dark:border-dark500`
      default:
        return `${maxWidth || 'md:max-w-xs @1600:max-w-full'} ${
          maxHeight || 'h-full'
        } py-1 px-2 xl:py-2 xl:px-3 dark:border-dark500`
    }
  }

  useEffect(() => {
    setReady(true)
  }, [])

  const contentClass = addClassString('flex flex-col h-full', [isDisabled && 'opacity-20'])

  // Icon component for different metric types
  const renderIcon = () => {
    if (!iconType || isSmall) return null

    const iconClasses = 'w-4 h-4 flex-shrink-0 flex items-center justify-center'
    const iconColor = chartColor || 'currentColor'

    switch (iconType) {
      case 'cpu':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-cpu text-current leading-none' />
          </div>
        )
      case 'ram':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-memory text-current leading-none' />
          </div>
        )
      case 'disk':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-hdd text-current leading-none' />
          </div>
        )
      case 'critical':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-exclamation-triangle-fill text-current leading-none' />
          </div>
        )
      case 'error':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-x-circle-fill text-current leading-none' />
          </div>
        )
      case 'warning':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-exclamation-circle-fill text-current leading-none' />
          </div>
        )
      case 'network':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-wifi text-current leading-none' />
          </div>
        )
      case 'beacon':
        return (
          <div className={iconClasses} style={{ color: iconColor }}>
            <i className='bi bi-broadcast text-current leading-none' />
          </div>
        )
      default:
        return null
    }
  }
  const renderContent = () => (
    <div className={contentClass}>
      {!metric && (
        <NotAvailable className='absolute opacity-60 w-20 text-dark100 dark:hidden right-0 top-1/2 transform -translate-y-1/2' />
      )}

      {/* Header with icon, title and metric */}
      <div
        className={`w-full z-10 flex items-center flex-shrink-0 mb-1 ${isSmall ? 'justify-between gap-2 min-w-0' : 'justify-between'}`}
      >
        <div className={`flex items-center gap-2 ${isSmall ? 'min-w-0 flex-shrink' : ''}`}>
          {renderIcon()}
          <Typography
            type={isSmall ? 'text-tiny' : 'text-caption1'}
            className={`${!isSmall ? 'xl:text-body' : ''} ${isSmall ? 'truncate' : ''} font-medium text-dark900 dark:text-white uppercase tracking-wide`}
          >
            {title}
          </Typography>
        </div>
        {metric && (
          <Typography
            type={isSmall ? 'text-tiny' : metricTextSize ? metricTextSize : 'text-caption1'}
            className={`${!isSmall && !metricTextSize ? 'xl:text-body' : ''} ${isSmall ? 'flex-shrink-0' : ''} font-normal text-dark600 dark:text-dark400`}
          >
            {metric}
          </Typography>
        )}
      </div>

      {/* Utilization percentage and status */}
      <div className='w-full z-10 flex items-center justify-between flex-shrink-0 mb-1'>
        {typeof subTitle === 'string' ? (
          <Typography
            type={isSmall ? 'text-tiny' : 'text-caption2'}
            className={`${
              subTitleHighlightColor
                ? `${subTitleHighlightColor} px-1.5 py-0.5 rounded text-xs font-medium`
                : 'text-dark500 dark:text-dark300 font-normal'
            } ${!subTitleHighlightColor ? '' : 'uppercase tracking-wide'}`}
          >
            {subTitle}
          </Typography>
        ) : (
          <div
            className={`${
              subTitleHighlightColor
                ? `${subTitleHighlightColor} px-1.5 py-0.5 rounded text-xs font-medium`
                : 'text-dark500 dark:text-dark300 font-normal'
            } ${!subTitleHighlightColor ? '' : 'uppercase tracking-wide'} ${
              isSmall ? 'text-tiny' : 'text-caption2'
            }`}
          >
            {subTitle}
          </div>
        )}
        <div className='flex items-center gap-1'>
          {percent ? (
            <ProgressCircle size='sm' id={generateId(12)} percent={percent} />
          ) : (
            status && <Status status={status} />
          )}
        </div>
      </div>

      {/* Chart fills remaining space at bottom */}
      {metric && size !== 'sm' && isBackground && chartData && chartColor && chartLabel && (
        <div className='w-full flex-1 min-h-0 mt-1 relative overflow-hidden rounded-md max-h-16'>
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
