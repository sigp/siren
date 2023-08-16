import SyncMetric from '../SyncMetric/SyncMetric'
import { useRecoilValue } from 'recoil'
import { useTranslation } from 'react-i18next'
import { selectValidatorSyncInfo } from '../../recoil/selectors/selectValidatorSyncInfo'
import { useEffect } from 'react'
import { StatusColor } from '../../types'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import { ALERT_ID } from '../../constants/constants'

const ValidatorMetric = () => {
  const { t } = useTranslation()
  const syncInfo = useRecoilValue(selectValidatorSyncInfo)
  const { storeAlert, removeAlert } = useDiagnosticAlerts()
  const { headSlot, cachedHeadSlot, syncPercentage, isReady } = syncInfo

  useEffect(() => {
    if (isReady) {
      removeAlert(ALERT_ID.VALIDATOR_SYNC)
      return
    }

    storeAlert({
      id: ALERT_ID.VALIDATOR_SYNC,
      severity: StatusColor.WARNING,
      subText: t('fair'),
      message: t('alertMessages.ethClientNotSync'),
    })
  }, [isReady])

  return (
    <SyncMetric
      id='ethMain'
      borderStyle='border-r'
      title={t('executionEngine')}
      subTitle={`${isReady ? t('synced') : t('syncing')} —`}
      percent={syncPercentage}
      amount={cachedHeadSlot}
      color='secondary'
      total={headSlot}
    />
  )
}

export default ValidatorMetric
