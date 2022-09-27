import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'

const DeviceHealth = () => {
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
    <div className='w-full h-24 flex space-x-2'>
      <DiagnosticSummaryCard type={DiagnosticType.DEVICE} rate={DiagnosticRate.FAIR} />
      <DiagnosticCard
        maxHeight='h-full'
        title='Disk'
        metric={`${totalDiskSpace.toFixed(1)}GB`}
        subTitle={`${diskUtilization}% Utilization`}
        status={diskStatus}
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='CPU'
        metric='- GHZ'
        subTitle={`${cpuUtilization}% Utilization`}
        status={cpuStatus}
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='RAM'
        metric={`${totalMemory.toFixed(1)}GB`}
        subTitle={`${memoryUtilization}% Utilization`}
        status={ramStatus}
      />
    </div>
  )
}

export default DeviceHealth
