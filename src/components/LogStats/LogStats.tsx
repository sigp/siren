import DiagnosticCard, { CardSize } from '../DiagnosticCard/DiagnosticCard'
import { useTranslation } from 'react-i18next'
import { LogCounts, StatusColor } from '../../types'
import { FC } from 'react'
import toFixedIfNecessary from '../../utilities/toFixedIfNecessary'

export interface LogStatsProps {
  critToolTip?: string
  warnToolTip?: string
  errorToolTip?: string
  logCounts: LogCounts
  size?: CardSize
  maxHeight?: string
  maxWidth?: string
}

const LogStats: FC<LogStatsProps> = ({
  logCounts,
  size,
  maxHeight = 'flex-1',
  maxWidth,
  critToolTip,
  warnToolTip,
  errorToolTip,
}) => {
  const { t } = useTranslation()
  const { totalLogsPerHour, criticalPerHour, warningsPerHour, errorsPerHour } = logCounts

  const criticalPercentage = (criticalPerHour / totalLogsPerHour) * 100
  const warnPercentage = (warningsPerHour / totalLogsPerHour) * 100
  const errorPercentage = (errorsPerHour / totalLogsPerHour) * 100

  const critStatus = totalLogsPerHour
    ? criticalPercentage > 0
      ? StatusColor.ERROR
      : StatusColor.SUCCESS
    : StatusColor.SUCCESS
  const errorStatus = totalLogsPerHour
    ? errorPercentage <= 0
      ? StatusColor.SUCCESS
      : errorPercentage <= 2
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.SUCCESS
  const warnStatus = totalLogsPerHour
    ? warnPercentage < 5
      ? StatusColor.SUCCESS
      : warnPercentage <= 50
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.SUCCESS

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
        metric={`${totalLogsPerHour ? toFixedIfNecessary(criticalPerHour, 2) : '0'} / HR`}
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
        metric={`${totalLogsPerHour ? toFixedIfNecessary(errorsPerHour, 2) : '0'} / HR`}
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
        metric={`${totalLogsPerHour ? toFixedIfNecessary(warningsPerHour, 2) : '0'} / HR`}
      />
    </>
  )
}

export default LogStats
