import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { ContentView } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import { dashView } from '../../recoil/atoms'
import { LogCounts } from '../../types'
import LogStats from '../LogStats/LogStats'
import { SSEContext } from '../SSELogProvider/SSELogProvider'
import Typography from '../Typography/Typography'

const LogsInfo = () => {
  const { t } = useTranslation()
  const { beaconLogs, vcLogs } = useContext(SSEContext)
  const setDashView = useSetRecoilState(dashView)
  const isMobile = useMediaQuery('(max-width: 425px)')

  const size = isMobile ? 'health' : 'md'

  const viewAllLogs = () => setDashView(ContentView.LOGS)

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
        <div onClick={viewAllLogs} className='cursor-pointer'>
          <Typography
            type='text-tiny'
            className='uppercase @1600:text-caption1'
            color='text-dark400'
          >
            {t('viewAll')}
          </Typography>
        </div>
      </div>
      <LogStats
        critToolTip={t('logs.tooltips.combinedCritical')}
        errorToolTip={t('logs.tooltips.combinedError')}
        warnToolTip={t('logs.tooltips.combinedWarning')}
        size={size}
        logCounts={combinedLogCounts}
      />
    </div>
  )
}

export default LogsInfo
