import SyncMetric from '../SyncMetric/SyncMetric';
import useBeaconSyncInfo from '../../hooks/useBeaconSyncInfo';

const BeaconMetric = () => {
  const { headSlot, slotDistance } = useBeaconSyncInfo()
  return (
    <SyncMetric
      id='beaconChain'
      borderStyle='border-r'
      title='BEACON CHAIN'
      amount={headSlot}
      total={slotDistance}
      direction='counter'
    />
  )
}

export default BeaconMetric;