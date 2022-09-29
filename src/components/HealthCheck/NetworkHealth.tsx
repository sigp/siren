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
    <div className='w-full md:h-24 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mt-8 md:mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        size='health'
        title='Disk'
        isBackground={false}
        subTitleHighlightColor='bg-warning'
        subTitle='Network Unavailable'
        status='bg-dark100'
      />
      <DiagnosticCard
        size='health'
        title='Ethereum Geth'
        metric='0H 01M'
        percent={25}
        isBackground={false}
        subTitle='Connected Out of Sync'
      />
      <DiagnosticCard
        size='health'
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
