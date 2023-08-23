import { useRecoilValue } from 'recoil'
import { beaconHealthResult, beaconSyncInfo, validatorHealthResult } from '../../recoil/atoms'
import NetworkStatBlock from './NetworkStatBlock'
import { useTranslation } from 'react-i18next'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import Spinner from '../Spinner/Spinner'
import formatAtHeadSlotStatus from '../../utilities/formatAtHeadSlotStatus'
import NetworkPeerSpeedometer from '../NetworkPeerSpeedometer/NetworkPeerSpeedometer'
import useParticipationRate from '../../hooks/useParticipationRate'
import addClassString from '../../utilities/addClassString'
import { StatusColor } from '../../types'

export const NetworkStatsFallback = () => (
  <div className='w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex items-center justify-center'>
    <Spinner />
  </div>
)

const NetworkStats = () => {
  const { t } = useTranslation()
  const validatorHealth = useRecoilValue(validatorHealthResult)
  const beaconHealth = useRecoilValue(beaconHealthResult)
  const { sync_distance } = useRecoilValue(beaconSyncInfo) || {}

  const { rate, isInsufficientData, status } = useParticipationRate()

  const atHeadSlot = sync_distance !== undefined ? -sync_distance : undefined

  const headSlotStatus = formatAtHeadSlotStatus(atHeadSlot)

  const validatorUpTime = secondsToShortHand(validatorHealth?.app_uptime || 0)
  const beaconUpTime = secondsToShortHand(beaconHealth?.app_uptime || 0)

  const hasParticipation = !isInsufficientData && rate !== undefined
  const participationClasses = addClassString('border-none', [!hasParticipation && 'opacity-20'])

  return (
    <div className='w-full z-50 md:h-18 lg:h-16 xl:h-14 dark:border dark:border-dark500 shadow flex flex-col md:flex-row'>
      <NetworkStatBlock
        toolTipId='vcTime'
        toolTipText={t('networkStats.toolTips.vcTime')}
        title={t('networkStats.processUptime')}
        subTitle='Validator'
        metric={validatorUpTime}
      />
      <NetworkStatBlock
        toolTipId='bnTime'
        toolTipText={t('networkStats.toolTips.bnTime')}
        title={t('networkStats.processUptime')}
        subTitle='Beacon Chain'
        metric={beaconUpTime}
      />
      <NetworkStatBlock
        toolTipId='slotBehind'
        toolTipWidth={300}
        toolTipText={t('networkStats.toolTips.slotBehind')}
        title={t('networkStats.blockBehind')}
        status={headSlotStatus}
        metricFontSize='text-subtitle3'
        metric={atHeadSlot === undefined ? '---' : String(atHeadSlot)}
      />
      <NetworkPeerSpeedometer />
      <NetworkStatBlock
        status={hasParticipation ? status : StatusColor.DARK}
        toolTipId='participationRate'
        toolTipWidth={200}
        toolTipText={
          hasParticipation
            ? t('networkStats.toolTips.participation')
            : t('networkStats.toolTips.noData')
        }
        className={participationClasses}
        title={t('networkStats.participationRate')}
        metricFontSize='text-subtitle3'
        metric={hasParticipation ? `${rate}%` : '---'}
      />
    </div>
  )
}

export default NetworkStats
