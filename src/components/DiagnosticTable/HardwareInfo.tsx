import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import Typography from '../Typography/Typography'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics';

const HardwareInfo = () => {
  const {
    totalDiskSpace,
    diskUtilization,
    diskStatus,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuUtilization,
    cpuStatus,
  } = useDeviceDiagnostics()

  return (
    <div className='h-full w-full flex flex-col xl:min-w-316'>
      <div className='w-full h-12 border flex border-style500'>
        <div className='flex-1 p-2 flex items-center justify-center cursor-pointer'>
          <Typography
            type='text-caption2'
            className='xl:text-caption1'
            color='text-primary'
            darkMode='dark:text-white'
            isBold
          >
            Hardware Usage
          </Typography>
        </div>
        <div className='flex-1 p-2 flex items-center justify-center cursor-pointer'>
          <Typography type='text-caption2' className='xl:text-caption1' color='text-dark500'>
            Device Diagnostics
          </Typography>
        </div>
      </div>
      <DiagnosticCard
        title='Disk'
        maxHeight='flex-1'
        border='border-t-0 border-style500'
        metric={`${totalDiskSpace.toFixed(1)}GB`}
        subTitle={`${diskUtilization}% Utilization`}
        status={diskStatus}
      />
      <DiagnosticCard
        title='CPU'
        maxHeight='flex-1'
        border='border-t-0 border-style500'
        metric='- GHZ'
        subTitle={`${cpuUtilization}% Utilization`}
        status={cpuStatus}
      />
      <DiagnosticCard
        title='RAM'
        maxHeight='flex-1'
        border='border-t-0 border-style500'
        metric={`${totalMemory.toFixed(1)}GB`}
        subTitle={`${memoryUtilization}% Utilization`}
        status={ramStatus}
      />
    </div>
  )
}

export default HardwareInfo
