import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import timeFilterObjArray from '../../../utilities/timeFilterObjArray'
import toFixedIfNecessary from '../../../utilities/toFixedIfNecessary'
import { LogMetric, StatusColor } from '../../types'
import DiagnosticCard, { CardSize } from '../DiagnosticCard/DiagnosticCard'

export interface LogStatsProps {
  critToolTip?: string
  warnToolTip?: string
  errorToolTip?: string
  metrics: LogMetric
  size?: CardSize
  maxHeight?: string
  maxWidth?: string
}

const LogStats: FC<LogStatsProps> = ({
  metrics,
  size,
  maxHeight = 'flex-1',
  maxWidth,
  critToolTip,
  warnToolTip,
  errorToolTip,
}) => {
  const { t } = useTranslation()
  const { criticalLogs, warningLogs, errorLogs } = metrics

  const hourlyCriticalLogs = useMemo(() => {
    return timeFilterObjArray(criticalLogs, 'createdAt', 'minutes', 60)
  }, [criticalLogs])

  const hourlyWarningLogs = useMemo(() => {
    return timeFilterObjArray(warningLogs, 'createdAt', 'minutes', 60)
  }, [warningLogs])

  const hourlyErrorLogs = useMemo(() => {
    return timeFilterObjArray(errorLogs, 'createdAt', 'minutes', 60)
  }, [errorLogs])

  const criticalMetrics = hourlyCriticalLogs.length
  const warningMetrics = hourlyWarningLogs.length
  const errorMetrics = hourlyErrorLogs.length

  const critStatus = criticalMetrics > 0 ? StatusColor.ERROR : StatusColor.SUCCESS
  const errorStatus =
    errorMetrics <= 0
      ? StatusColor.SUCCESS
      : errorMetrics <= 2
        ? StatusColor.WARNING
        : StatusColor.ERROR
  const warnStatus =
    warningMetrics < 5
      ? StatusColor.SUCCESS
      : warningMetrics <= 50
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
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('critical')}
        metric={`${toFixedIfNecessary(criticalMetrics, 2)} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('errors')}
        toolTipText={errorToolTip}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={errorStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${toFixedIfNecessary(errorMetrics, 2)} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('logInfo.warnings')}
        toolTipText={warnToolTip}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={warnStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${toFixedIfNecessary(warningMetrics, 2)} / HR`}
      />
    </>
  )
}

export default LogStats
