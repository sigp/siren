import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import secondsToShortHand from '../../../utilities/secondsToShortHand'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import SyncCard from '../SyncCard/SyncCard'

const BeaconSyncCard = () => {
  const { t } = useTranslation()
  const { headSlot, slotDistance, beaconPercentage, beaconSyncTime } =
    useRecoilValue(selectBeaconSyncInfo)
  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <SyncCard
      type='beacon'
      title='Ethereum Beacon'
      subTitle='Lighthouse Node'
      timeRemaining={beaconSyncTime ? remainingBeaconTime : t('synced')}
      status={`${formatLocalCurrency(headSlot, { isStrict: true })} / ${formatLocalCurrency(
        slotDistance,
        { isStrict: true },
      )}`}
      progress={beaconPercentage}
    />
  )
}

export default BeaconSyncCard
