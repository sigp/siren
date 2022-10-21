import SyncCard from '../SyncCard/SyncCard'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'

const BeaconSyncCard = () => {
  const { headSlot, slotDistance, beaconPercentage, beaconSyncTime } =
    useRecoilValue(selectBeaconSyncInfo)
  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <SyncCard
      type='beacon'
      title='Ethereum Beacon'
      subTitle='Lighthouse Node'
      timeRemaining={remainingBeaconTime}
      status={`${headSlot} / ${slotDistance}`}
      progress={beaconPercentage}
    />
  )
}

export default BeaconSyncCard
