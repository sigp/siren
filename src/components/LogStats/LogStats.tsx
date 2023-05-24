import DiagnosticCard, { CardSize } from '../DiagnosticCard/DiagnosticCard'
import { useTranslation } from 'react-i18next'
import { LogCounts, StatusColor } from '../../types'
import { FC } from 'react'

export interface LogStatsProps {
  logCounts: LogCounts
  size?: CardSize
  maxHeight?: string
  maxWidth?: string
}

const LogStats: FC<LogStatsProps> = ({ logCounts, size, maxHeight = 'flex-1', maxWidth }) => {
  const { t } = useTranslation()
  const { totalLogsPerHour, criticalPerHour, warningsPerHour, errorsPerHour } = logCounts

  const criticalPercentage = (criticalPerHour / totalLogsPerHour) * 100
  const warnPercentage = (warningsPerHour / totalLogsPerHour) * 100
  const errorPercentage = (errorsPerHour / totalLogsPerHour) * 100

  const critStatus = totalLogsPerHour
    ? criticalPercentage > 0
      ? StatusColor.ERROR
      : StatusColor.SUCCESS
    : StatusColor.DARK
  const errorStatus = totalLogsPerHour
    ? errorPercentage <= 0
      ? StatusColor.SUCCESS
      : errorPercentage <= 2
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.DARK
  const warnStatus = totalLogsPerHour
    ? warnPercentage < 5
      ? StatusColor.SUCCESS
      : warnPercentage <= 50
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.DARK

  return (
    <>
      <DiagnosticCard
        title={t('logInfo.criticalLogs')}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={critStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('critical')}
        metric={`${totalLogsPerHour ? criticalPerHour : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('errors')}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={errorStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${totalLogsPerHour ? errorPercentage.toFixed(2) : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('logInfo.warnings')}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        status={warnStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${totalLogsPerHour ? warnPercentage.toFixed(2) : '-'} / HR`}
      />
    </>
  )
}

export default LogStats
