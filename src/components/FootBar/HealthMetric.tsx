import DiagnosticCard from '../DiagnosticCard/DiagnosticCard';
import useBeaconSyncInfo from '../../hooks/useBeaconSyncInfo';
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics';
import Spinner from '../Spinner/Spinner';

export const HealthMetricFallback = () => (
  <div className="border border-dark200 flex items-center justify-center w-40 h-11 p-1 dark:border-none px-1.5">
    <Spinner size="h-4 w-4"/>
  </div>
)

const HealthMetric = () => {
  const { isSyncing } = useBeaconSyncInfo()
  const { healthCondition, overallHealthStatus } = useDeviceDiagnostics()

  return (
    <DiagnosticCard
      border='border-x border-dark200'
      title='Health Check'
      metric='Uptime: 2H 44M'
      status={overallHealthStatus}
      subTitle={`${healthCondition}, Nodes ${isSyncing ? 'Syncing' : 'Synced'}...`}
      size='sm'
    />
  )
}

export default HealthMetric;