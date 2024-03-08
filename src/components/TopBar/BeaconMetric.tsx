import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { ALERT_ID } from '../../constants/constants'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import { StatusColor } from '../../types'
import SyncMetric from '../SyncMetric/SyncMetric'

const BeaconMetric = () => {
  const { t } = useTranslation()
  const { headSlot, slotDistance, isSyncing, beaconPercentage } =
    useRecoilValue(selectBeaconSyncInfo)
  const { storeAlert, removeAlert } = useDiagnosticAlerts()

  useEffect(() => {
    if (isSyncing) {
      storeAlert({
        id: ALERT_ID.BEACON_SYNC,
        severity: StatusColor.WARNING,
        subText: t('fair'),
        message: t('alertMessages.beaconNotSync'),
      })
    } else {
      removeAlert(ALERT_ID.BEACON_SYNC)
    }
  }, [isSyncing])

  return (
    <SyncMetric
      id='beaconChain'
      borderStyle='border-r'
      title='BEACON CHAIN'
      className='md:ml-4'
      subTitle={`${isSyncing ? t('syncing') : slotDistance ? t('synced') : ''} —`}
      percent={beaconPercentage}
      amount={headSlot}
      total={slotDistance}
      direction='counter'
    />
  )
}

export default BeaconMetric
