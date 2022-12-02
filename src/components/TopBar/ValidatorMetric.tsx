import SyncMetric from '../SyncMetric/SyncMetric'
import { useRecoilValue } from 'recoil'
import { useTranslation } from 'react-i18next'
import { selectValidatorSyncInfo } from '../../recoil/selectors/selectValidatorSyncInfo'

const ValidatorMetric = () => {
  const { t } = useTranslation()
  const syncInfo = useRecoilValue(selectValidatorSyncInfo)
  const { headSlot, cachedHeadSlot, syncPercentage, isReady } = syncInfo

  return (
    <SyncMetric
      id='ethMain'
      borderStyle='border-r'
      title='ETHEREUM MAINNET'
      subTitle={`${isReady ? t('synced') : t('syncing')} —`}
      percent={syncPercentage}
      amount={cachedHeadSlot}
      color='secondary'
      total={headSlot}
    />
  )
}

export default ValidatorMetric
