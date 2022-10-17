import SyncMetric from '../SyncMetric/SyncMetric'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil';
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo';

const BeaconMetric = () => {
  const { t } = useTranslation()
  const { headSlot, slotDistance, isSyncing, beaconPercentage } = useRecoilValue(selectBeaconSyncInfo)

  return (
    <SyncMetric
      id='beaconChain'
      borderStyle='border-r'
      title='BEACON CHAIN'
      subTitle={`${isSyncing ? t('syncing') : slotDistance ? t('synced') : ''} —`}
      percent={beaconPercentage}
      amount={headSlot}
      total={slotDistance}
      direction='counter'
    />
  )
}

export default BeaconMetric
