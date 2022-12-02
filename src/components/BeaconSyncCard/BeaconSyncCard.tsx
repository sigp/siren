import SyncCard from '../SyncCard/SyncCard'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency'
import { useTranslation } from 'react-i18next'

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
