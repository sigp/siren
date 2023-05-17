import Typography from '../Typography/Typography'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '../../hooks/useMediaQuery'
import { StatusColor } from '../../types'
import { useContext } from 'react'
import { SSEContext } from '../SSELogProvider/SSELogProvider'

const LogsInfo = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 425px)')
  const { beaconLogs, vcLogs } = useContext(SSEContext)

  const totalLogs = beaconLogs.totalLogsPerHour + vcLogs.totalLogsPerHour

  const criticalPercentage =
    ((beaconLogs.criticalPerHour + vcLogs.criticalPerHour) / totalLogs) * 100
  const warnPercentage = ((beaconLogs.warningsPerHour + vcLogs.warningsPerHour) / totalLogs) * 100
  const errorPercentage = ((beaconLogs.errorsPerHour + vcLogs.errorsPerHour) / totalLogs) * 100

  const critStatus = totalLogs
    ? criticalPercentage > 0
      ? StatusColor.ERROR
      : StatusColor.SUCCESS
    : StatusColor.DARK
  const errorStatus = totalLogs
    ? errorPercentage <= 0
      ? StatusColor.SUCCESS
      : errorPercentage <= 2
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.DARK
  const warnStatus = totalLogs
    ? warnPercentage < 5
      ? StatusColor.SUCCESS
      : warnPercentage <= 50
      ? StatusColor.WARNING
      : StatusColor.ERROR
    : StatusColor.DARK

  const size = isMobile ? 'health' : 'md'
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 md:border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('logInfo.logs')}
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          {t('viewAll')}
        </Typography>
      </div>
      <DiagnosticCard
        title={t('logInfo.criticalLogs')}
        maxHeight='flex-1'
        status={critStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('critical')}
        metric={`${totalLogs ? criticalPercentage.toFixed(2) : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('errors')}
        maxHeight='flex-1'
        status={errorStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${totalLogs ? errorPercentage.toFixed(2) : '-'} / HR`}
      />
      <DiagnosticCard
        isBackground={false}
        title={t('logInfo.warnings')}
        maxHeight='flex-1'
        status={warnStatus}
        size={size}
        border='border-t-0 md:border-l-0 border-style500'
        subTitle={t('logInfo.validatorLogs')}
        metric={`${totalLogs ? warnPercentage.toFixed(2) : '-'} / HR`}
      />
    </div>
  )
}

export default LogsInfo
