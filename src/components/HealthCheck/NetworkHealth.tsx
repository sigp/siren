import { FC } from 'react';
import { useTranslation } from 'react-i18next'
import formatBnSyncInfo from '../../../utilities/formatBnSyncInfo';
import formatExecSyncInfo from '../../../utilities/formatExecSyncInfo';
import secondsToShortHand from '../../../utilities/secondsToShortHand'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import { StatusColor } from '../../types'
import { BeaconSyncResult, HealthDiagnosticResult, ValidatorSyncResult } from '../../types/diagnostic';
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'

export interface NetworkHealthProps {
  bnSyncInfo: BeaconSyncResult
  bnHealth: HealthDiagnosticResult
  exSyncInfo: ValidatorSyncResult
}

const NetworkHealth:FC<NetworkHealthProps> = ({bnSyncInfo, exSyncInfo, bnHealth}) => {
  const { t } = useTranslation()
  const { beaconPercentage, beaconSyncTime } = formatBnSyncInfo(bnSyncInfo)
  const { isReady, syncPercentage } = formatExecSyncInfo(exSyncInfo)
  const { networkName, natOpen } = useDeviceDiagnostics(bnHealth)

  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  const metric = networkName
    ? natOpen
      ? t('vcHealthCheck.natOpen')
      : t('vcHealthCheck.natClosed')
    : undefined

  return (
    <div className='w-full md:h-24 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mt-8 md:mt-2'>
      <DiagnosticSummaryCard type={DiagnosticType.NETWORK} rate={DiagnosticRate.GREAT} />
      <DiagnosticCard
        size='health'
        title={t('network')}
        isBackground={false}
        metricTextSize='text-caption2'
        metric={metric?.toUpperCase()}
        subTitleHighlightColor='bg-warning'
        subTitle={
          networkName
            ? t('vcHealthCheck.networkName', { network: networkName })
            : t('networkUnavailable')
        }
        status={natOpen ? StatusColor.SUCCESS : StatusColor.DARK}
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
        metric={beaconSyncTime === 0 ? ' ' : remainingBeaconTime}
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
