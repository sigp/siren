import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'

const NetworkHealth = () => {
  const data = useRecoilValue(selectBeaconSyncInfo)

  console.log(data)

  return (
    <div className='w-full h-24 flex space-x-2 mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        maxHeight='h-full'
        title='Disk'
        metric='511GB'
        subTitle='22% Utilization'
        status='bg-success'
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

export default NetworkHealth
