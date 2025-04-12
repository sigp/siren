import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import formatAtHeadSlotStatus from '../../../utilities/formatAtHeadSlotStatus'
import { SyncData } from '../../types/beacon'
import { Diagnostics, PeerDataResults } from '../../types/diagnostic'
import { ValidatorInclusionData } from '../../types/validator'
import NetworkPeerSpeedometer from '../NetworkPeerSpeedometer/NetworkPeerSpeedometer'
import NetworkStatBlock from './NetworkStatBlock'

export interface NetworkStatsProps {
  nodeHealth: Diagnostics
  peerData: PeerDataResults
  syncData: SyncData
  valInclusionData: ValidatorInclusionData
}

const NetworkStats: FC<NetworkStatsProps> = ({
  nodeHealth,
  syncData,
  peerData,
  valInclusionData,
}) => {
  const { t } = useTranslation()
  const {
    uptime: { beacon, validator },
  } = nodeHealth
  const {
    beaconSync: { syncDistance },
  } = syncData

  const { rate, status } = valInclusionData
  const headSlotStatus = formatAtHeadSlotStatus(syncDistance)

  const participationClasses = addClassString('border-none', [!rate && 'opacity-20'])

  return (
    <div className='w-full z-50 md:h-18 lg:h-16 xl:h-14 dark:border dark:border-dark500 shadow flex flex-col md:flex-row'>
      <NetworkStatBlock
        toolTipId='vcTime'
        toolTipText={t('networkStats.toolTips.vcTime')}
        title={t('networkStats.processUptime')}
        subTitle='Validator'
        metric={validator}
      />
      <NetworkStatBlock
        toolTipId='bnTime'
        toolTipText={t('networkStats.toolTips.bnTime')}
        title={t('networkStats.processUptime')}
        subTitle='Beacon Chain'
        metric={beacon}
      />
      <NetworkStatBlock
        toolTipId='slotBehind'
        toolTipWidth={300}
        toolTipText={t('networkStats.toolTips.slotBehind')}
        title={t('networkStats.blockBehind')}
        status={headSlotStatus}
        metricFontSize='text-subtitle3'
        metric={String(syncDistance)}
      />
      <NetworkPeerSpeedometer peerData={peerData} />
      <NetworkStatBlock
        status={status}
        toolTipId='participationRate'
        toolTipWidth={200}
        toolTipText={
          rate ? t('networkStats.toolTips.participation') : t('networkStats.toolTips.noData')
        }
        className={participationClasses}
        title={t('networkStats.participationRate')}
        metricFontSize='text-subtitle3'
        metric={rate ? `${rate}%` : '---'}
      />
    </div>
  )
}

export default NetworkStats
