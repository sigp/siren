import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import { useRecoilValue } from 'recoil'
import { selectHeathDiagnostic } from '../../recoil/selectors/selectHeathDiagnostic'
import { useMemo } from 'react'
import formatGigBytes from '../../utilities/formatGigBytes'
import getPercentage from '../../utilities/getPercentage'

const DeviceHealth = () => {
  const { mem_free, mem_used, mem_total } = useRecoilValue(selectHeathDiagnostic)

  const diskUtilization = useMemo(
    () => (mem_used && mem_total ? Math.round(getPercentage(mem_used, mem_total)) : 0),
    [mem_used, mem_total],
  )
  const totalDiskFree = useMemo(() => formatGigBytes(mem_free), [mem_free])
  const diskStatus = useMemo(
    () =>
      totalDiskFree > 300
        ? 'bg-success'
        : totalDiskFree > 200 && totalDiskFree < 300
        ? 'bg-warning'
        : 'bg-error',
    [totalDiskFree],
  )

  return (
    <div className='w-full h-24 flex space-x-2'>
      <DiagnosticSummaryCard type={DiagnosticType.DEVICE} rate={DiagnosticRate.FAIR} />
      <DiagnosticCard
        maxHeight='h-full'
        title='Disk'
        metric={`${totalDiskFree.toFixed(1)}GB`}
        subTitle={`${diskUtilization}% Utilization`}
        status={diskStatus}
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='CPU'
        metric='1.9GHZ'
        subTitle='13% Utilization'
        status='bg-warning'
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='RAM'
        metric='15.9GB'
        subTitle='48% Utilization'
        status='bg-error'
      />
    </div>
  )
}

export default DeviceHealth
