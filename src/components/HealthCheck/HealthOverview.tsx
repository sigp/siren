import Typography from '../Typography/Typography'
import DiagnosticOverviewText from '../DiagnosticOverviewText/DiagnosticOverviewText'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'

const HealthOverview = () => {
  const { totalDiskFree } = useDeviceDiagnostics()

  const isSufficientSpace = totalDiskFree > 240

  return (
    <div className='mt-4 w-full p-4 border border-dark200'>
      <div className='space-y-12'>
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
        <div className='flex space-x-4 items-center'>
          <i className='bi-info-circle text-caption1 text-primary' />
          <Typography
            isBold
            family='font-archivo'
            color='text-primary'
            type='text-caption1'
            className='uppercase'
          >
            view important disclosures
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default HealthOverview
