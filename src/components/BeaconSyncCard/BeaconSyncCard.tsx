import SyncCard from '../SyncCard/SyncCard'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency';

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
      status={`${formatLocalCurrency(headSlot, {isStrict: true})} / ${formatLocalCurrency(slotDistance, {isStrict: true})}`}
      progress={beaconPercentage}
    />
  )
}

export default BeaconSyncCard
