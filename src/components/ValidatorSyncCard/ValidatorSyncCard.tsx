import SyncCard from '../SyncCard/SyncCard'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency'
import { selectValidatorSyncInfo } from '../../recoil/selectors/selectValidatorSyncInfo'

const ValidatorSyncCard = () => {
  const { t } = useTranslation()

  const { syncPercentage, headSlot, cachedHeadSlot } = useRecoilValue(selectValidatorSyncInfo)

  return (
    <SyncCard
      title='Ethereum Mainnet'
      subTitle='Execution Node'
      type='geth'
      timeRemaining=' '
      status={
        cachedHeadSlot
          ? `${formatLocalCurrency(cachedHeadSlot, { isStrict: true })} / ${formatLocalCurrency(
              headSlot,
              { isStrict: true },
            )}`
          : t('noConnection')
      }
      progress={syncPercentage}
    />
  )
}

export default ValidatorSyncCard
