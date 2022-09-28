import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import useBeaconSyncInfo from '../../hooks/useBeaconSyncInfo'
import { useMemo } from 'react'
import secondsToShortHand from '../../utilities/secondsToShortHand'

const NetworkHealth = () => {
  const { beaconPercentage, beaconSyncTime } = useBeaconSyncInfo()

  const remainingBeaconTime = useMemo<string>(
    () => secondsToShortHand(beaconSyncTime || 0),
    [beaconSyncTime],
  )

  return (
    <div className='w-full h-24 flex space-x-2 mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        maxHeight='h-full'
        title='Disk'
        isBackground={false}
        subTitleHighlightColor='bg-warning'
        subTitle='Network Unavailable'
        status='bg-dark100'
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='Ethereum Geth'
        metric='0H 01M'
        percent={25}
        isBackground={false}
        subTitle='Connected Out of Sync'
      />
      <DiagnosticCard
        maxHeight='h-full'
        title='Beacon Node'
        metric={remainingBeaconTime}
        percent={beaconPercentage}
        isBackground={false}
        subTitle={`Connected ${beaconPercentage < 100 ? 'Out of Sync' : 'In Sync'}`}
      />
    </div>
  )
}

export default NetworkHealth
