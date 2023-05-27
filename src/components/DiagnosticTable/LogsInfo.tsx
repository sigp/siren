import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import { useContext, useMemo } from 'react'
import { SSEContext } from '../SSELogProvider/SSELogProvider'
import LogStats from '../LogStats/LogStats'
import { LogCounts } from '../../types'
import useMediaQuery from '../../hooks/useMediaQuery'

const LogsInfo = () => {
  const { t } = useTranslation()
  const { beaconLogs, vcLogs } = useContext(SSEContext)
  const isMobile = useMediaQuery('(max-width: 425px)')

  const size = isMobile ? 'health' : 'md'

  const combinedLogCounts = useMemo<LogCounts>(() => {
    return {
      totalLogsPerHour: beaconLogs.totalLogsPerHour + vcLogs.totalLogsPerHour,
      criticalPerHour: beaconLogs.criticalPerHour + vcLogs.criticalPerHour,
      warningsPerHour: beaconLogs.warningsPerHour + vcLogs.warningsPerHour,
      errorsPerHour: beaconLogs.errorsPerHour + vcLogs.errorsPerHour,
    }
  }, [beaconLogs, vcLogs])

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
      <LogStats size={size} logCounts={combinedLogCounts} />
    </div>
  )
}

export default LogsInfo
