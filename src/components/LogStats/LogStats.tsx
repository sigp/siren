import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import { useTranslation } from 'react-i18next'
import { LogCounts, StatusColor } from '../../types'
import { FC } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'

export interface LogStatsProps {
  logCounts: LogCounts
}

const LogStats: FC<LogStatsProps> = ({ logCounts }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 425px)')
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

  const size = isMobile ? 'health' : 'md'

  return (
    <>
      <DiagnosticCard
        title={t('logInfo.criticalLogs')}
        maxHeight='flex-1'
        status={critStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('critical')}
        metric={`${totalLogsPerHour ? criticalPerHour : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('errors')}
        maxHeight='flex-1'
        status={errorStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${totalLogsPerHour ? errorPercentage.toFixed(2) : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('logInfo.warnings')}
        maxHeight='flex-1'
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
