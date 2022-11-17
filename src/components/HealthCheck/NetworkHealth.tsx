import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import { selectValidatorSyncInfo } from '../../recoil/selectors/selectValidatorSyncInfo';
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics';

const NetworkHealth = () => {
  const { t } = useTranslation()
  const { beaconPercentage, beaconSyncTime } = useRecoilValue(selectBeaconSyncInfo)
  const  { isReady, syncPercentage } = useRecoilValue(selectValidatorSyncInfo)
  const {
    networkName,
    natOpen
  } = useDeviceDiagnostics()

  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <div className='w-full md:h-24 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mt-8 md:mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        size='health'
        title={t('network')}
        isBackground={false}
        metric={networkName ? ' ' : undefined}
        subTitleHighlightColor='bg-warning'
        subTitle={networkName ? networkName : t('networkUnavailable')}
        status={natOpen ? 'bg-success' : 'bg-dark100'}
      />
      <DiagnosticCard
        size='health'
        title='Ethereum Geth'
        metric=' '
        percent={syncPercentage}
        isBackground={false}
        subTitle={t('connectedStatus', { status: isReady ? t('inSync') : t('outOfSync') })}
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
