import SyncMetric from '../SyncMetric/SyncMetric';
import useBeaconSyncInfo from '../../hooks/useBeaconSyncInfo';
import { useTranslation } from 'react-i18next';

const BeaconMetric = () => {
  const {t} = useTranslation()
  const { headSlot, slotDistance, isSyncing, beaconPercentage } = useBeaconSyncInfo()

  return (
    <SyncMetric
      id='beaconChain'
      borderStyle='border-r'
      title='BEACON CHAIN'
      subTitle={`${isSyncing ? t('syncing') : slotDistance ? t('synced'): ''} —`}
      percent={beaconPercentage}
      amount={headSlot || 0}
      total={slotDistance || 0}
      direction='counter'
    />
  )
}

export default BeaconMetric;