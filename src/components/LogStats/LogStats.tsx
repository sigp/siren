import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import toFixedIfNecessary from '../../../utilities/toFixedIfNecessary'
import useMetricHistory from '../../hooks/useMetricHistory'
import { Metric, StatusColor } from '../../types'
import DiagnosticCard, { CardSize } from '../DiagnosticCard/DiagnosticCard'

export interface LogStatsProps {
  critToolTip?: string
  warnToolTip?: string
  errorToolTip?: string
  logMetrics: Metric
  size?: CardSize
  maxHeight?: string
  maxWidth?: string
  isCompact?: boolean
}

const LogStats: FC<LogStatsProps> = ({
  size,
  maxHeight = 'flex-1',
  maxWidth,
  critToolTip,
  warnToolTip,
  errorToolTip,
  logMetrics,
  isCompact = false,
}) => {
  const { t } = useTranslation()
  const { errorCount, criticalCount, warningCount } = logMetrics

  // Get historical data for log charts - we don't need hardware metrics so pass zeros
  const { criticalLogsHistory, errorLogsHistory, warningLogsHistory } = useMetricHistory(
    '0',
    0,
    0,
    criticalCount,
    errorCount,
    warningCount,
  )

  const critStatus = criticalCount > 0 ? StatusColor.ERROR : StatusColor.SUCCESS
  const errorStatus =
    errorCount <= 0
      ? StatusColor.SUCCESS
      : errorCount <= 2
        ? StatusColor.WARNING
        : StatusColor.ERROR
  const warnStatus =
    warningCount < 5
      ? StatusColor.SUCCESS
      : warningCount <= 50
        ? StatusColor.WARNING
        : StatusColor.ERROR

  return (
    <>
      <DiagnosticCard
        title={t('logInfo.criticalLogs')}
        toolTipText={critToolTip}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={critStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500 border-b border-b-style500'
        subTitle={t('critical')}
        metric={`${toFixedIfNecessary(criticalCount, 2)} / HR`}
        chartData={isCompact ? undefined : criticalLogsHistory}
        chartColor={isCompact ? undefined : '#D541B8'}
        chartLabel={isCompact ? undefined : 'Critical Logs'}
        isChartPercentage={false}
        iconType='critical'
      />
      <DiagnosticCard
        title={t('errors')}
        toolTipText={errorToolTip}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={errorStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500 border-b border-b-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${toFixedIfNecessary(errorCount, 2)} / HR`}
        chartData={isCompact ? undefined : errorLogsHistory}
        chartColor={isCompact ? undefined : '#836FFF'}
        chartLabel={isCompact ? undefined : 'Error Logs'}
        isChartPercentage={false}
        iconType='error'
      />
      <DiagnosticCard
        title={t('logInfo.warnings')}
        toolTipText={warnToolTip}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={warnStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500 border-b border-b-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${toFixedIfNecessary(warningCount, 2)} / HR`}
        chartData={isCompact ? undefined : warningLogsHistory}
        chartColor={isCompact ? undefined : '#5200FF'}
        chartLabel={isCompact ? undefined : 'Warning Logs'}
        isChartPercentage={false}
        iconType='warning'
      />
    </>
  )
}

export default LogStats
