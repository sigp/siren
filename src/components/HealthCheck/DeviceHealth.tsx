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
    <div className='w-full md:h-24 flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-2'>
      <DiagnosticSummaryCard type={DiagnosticType.DEVICE} rate={DiagnosticRate.FAIR} />
      <DiagnosticCard
        size='health'
        title='Disk'
        metric={`${totalDiskSpace.toFixed(1)}GB`}
        subTitle={`${diskUtilization}% Utilization`}
        status={diskStatus}
      />
      <DiagnosticCard
        size='health'
        title='CPU'
        metric='- GHZ'
        subTitle={`${cpuUtilization}% Utilization`}
        status={cpuStatus}
      />
      <DiagnosticCard
        size='health'
        title='RAM'
        metric={`${totalMemory.toFixed(1)}GB`}
        subTitle={`${memoryUtilization}% Utilization`}
        status={ramStatus}
      />
    </div>
  )
}

export default DeviceHealth
