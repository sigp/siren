import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'

const NetworkHealth = () => {
  const { t } = useTranslation()
  const { beaconPercentage, beaconSyncTime } = useRecoilValue(selectBeaconSyncInfo)

  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <div className='w-full md:h-24 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mt-8 md:mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        size='health'
        title={t('network')}
        isBackground={false}
        subTitleHighlightColor='bg-warning'
        subTitle={t('networkUnavailable')}
        status='bg-dark100'
      />
      <DiagnosticCard
        size='health'
        title='Ethereum Geth'
        metric='0H 01M'
        percent={25}
        isBackground={false}
        subTitle={t('connectedStatus', { status: t('outOfSync') })}
      />
      <DiagnosticCard
        size='health'
        title='Beacon Node'
        metric={remainingBeaconTime}
        percent={beaconPercentage}
        isBackground={false}
        subTitle={t('connectedStatus', {
          status: beaconPercentage < 100 ? t('outOfSync') : t('inSync'),
        })}
      />
    </div>
  )
}

export default NetworkHealth
