import Typography from '../Typography/Typography'
import DiagnosticOverviewText from '../DiagnosticOverviewText/DiagnosticOverviewText'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import Status from '../Status/Status'
import { ReactComponent as HealthSvg } from '../../assets/images/health.svg'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import ViewDisclosures from '../ViewDisclosures/ViewDisclosures';

const HealthOverview = () => {
  const { totalDiskFree, uptime, healthCondition, overallHealthStatus } = useDeviceDiagnostics()

  const upTimeShortHand = secondsToShortHand(uptime)

  const isSufficientSpace = totalDiskFree > 240

  return (
    <div className='relative overflow-hidden mt-4 w-full md:h-64 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between p-4 border border-dark200'>
      <div className='relative z-10 h-full flex flex-col space-y-4 md:space-y-0 justify-between'>
        <div className='space-y-3'>
          <Typography isBold family='font-archivo' type='text-caption1'>
            Diagnostics
            <br />
            overview —
          </Typography>
          <DiagnosticOverviewText
            status={isSufficientSpace ? 'text-success' : 'text-error'}
            text={`Disk ${
              isSufficientSpace ? 'has' : 'does not have'
            } the required 240GB for the full sync.`}
          />
          <DiagnosticOverviewText status='text-success' text='Network is low latency.' />
          <DiagnosticOverviewText status='text-warning' text='2.4GHZ is recommended for CPU.' />
          <DiagnosticOverviewText
            status='text-error'
            text='Please ensure your RAM is sufficient prior to starting validating.'
          />
        </div>
        <ViewDisclosures/>
      </div>
      <div className='relative z-10 h-full flex flex-col space-y-4 md:space-y-0 justify-between'>
        <div className='flex space-x-12'>
          <div className='space-y-4'>
            <Typography>Uptime</Typography>
            <Typography color='text-dark400'>
              — <br /> Nodes <br /> Syncing
            </Typography>
          </div>
          <Typography type='text-subtitle2'>{upTimeShortHand}</Typography>
        </div>
        <div className='self-stretch w-full flex items-center justify-between'>
          <Typography isBold type='text-tiny' color='text-primary' className='uppercase'>
            HEALTH CHECK — in {healthCondition} Condition.
          </Typography>
          <Status status={overallHealthStatus} />
        </div>
      </div>
      <HealthSvg className='opacity-70 absolute right-2.5 bottom-0' />
    </div>
  )
}

export default HealthOverview
