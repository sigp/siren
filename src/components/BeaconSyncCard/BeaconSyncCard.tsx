import SyncCard from '../SyncCard/SyncCard';
import useBeaconSyncInfo from '../../hooks/useBeaconSyncInfo';
import secondsToShortHand from '../../utilities/secondsToShortHand';

const BeaconSyncCard = () => {
  const { beaconPercentage, beaconSyncTime, headSlot, slotDistance } = useBeaconSyncInfo()
  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <SyncCard
      type="beacon"
      title='Ethereum Beacon'
      subTitle='Lighthouse Node'
      timeRemaining={remainingBeaconTime}
      status={`${headSlot} / ${slotDistance}`}
      progress={beaconPercentage}
    />
  )
}

export default BeaconSyncCard;