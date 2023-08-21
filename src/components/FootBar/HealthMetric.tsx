import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import Spinner from '../Spinner/Spinner'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'

export const HealthMetricFallback = () => (
  <div className='border border-dark200 flex items-center justify-center w-40 h-11 p-1 dark:border-none px-1.5'>
    <Spinner size='h-4 w-4' />
  </div>
)

const HealthMetric = () => {
  const { t } = useTranslation()
  const { isSyncing } = useRecoilValue(selectBeaconSyncInfo)
  const { healthCondition, overallHealthStatus, uptime } = useDeviceDiagnostics()

  return (
    <DiagnosticCard
      border='border-x border-dark200'
      title={t('healthCheck')}
      metric={`${t('uptime')} ${uptime}`}
      status={overallHealthStatus}
      subTitle={`${t(healthCondition.toLowerCase()).toUpperCase()}, ${t('nodes')} ${
        isSyncing ? t('syncing') : t('synced')
      }...`}
      maxWidth='w-fit'
      size='sm'
    />
  )
}

export default HealthMetric
