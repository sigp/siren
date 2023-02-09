import { useRecoilValue } from 'recoil'
import { beaconHealthResult, validatorHealthResult } from '../../recoil/atoms'
import NetworkStatBlock from './NetworkStatBlock'
import { useTranslation } from 'react-i18next'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import Spinner from '../Spinner/Spinner'
import formatAtHeadSlotStatus from '../../utilities/formatAtHeadSlotStatus'
import NetworkPeerSpeedometer from '../NetworkPeerSpeedometer/NetworkPeerSpeedometer'
import { selectAtHeadSlot } from '../../recoil/selectors/selectAtHeadSlot'
import useParticipationRate from '../../hooks/useParticipationRate'
import Tooltip from '../ToolTip/Tooltip'

export const NetworkStatsFallback = () => (
  <div className='w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex items-center justify-center'>
    <Spinner />
  </div>
)

const NetworkStats = () => {
  const { t } = useTranslation()
  const validatorHealth = useRecoilValue(validatorHealthResult)
  const beaconHealth = useRecoilValue(beaconHealthResult)

  const { rate, isInsufficientData, status } = useParticipationRate()

  const atHeadSlot = useRecoilValue(selectAtHeadSlot)
  const headSlotStatus = formatAtHeadSlotStatus(atHeadSlot)

  const validatorUpTime = secondsToShortHand(validatorHealth?.app_uptime || 0)
  const beaconUpTime = secondsToShortHand(beaconHealth?.app_uptime || 0)

  return (
    <div className='w-full z-50 h-18 lg:h-16 xl:h-14 dark:border dark:border-dark500 shadow flex flex-col md:flex-row'>
      <NetworkStatBlock
        title={t('networkStats.processUptime')}
        subTitle='Validator'
        metric={validatorUpTime}
      />
      <NetworkStatBlock
        title={t('networkStats.processUptime')}
        subTitle='Beacon Chain'
        metric={beaconUpTime}
      />
      <NetworkStatBlock
        title={t('networkStats.headSlot')}
        status={headSlotStatus}
        metricFontSize='text-subtitle3'
        metric={atHeadSlot !== undefined ? String(atHeadSlot === 1 ? 0 : atHeadSlot) : '---'}
      />
      <NetworkPeerSpeedometer />
      {isInsufficientData || rate === undefined ? (
        <Tooltip id='participationRate' text='Insufficient Data' place='bottom'>
          <NetworkStatBlock
            className='border-none opacity-20 pointer-events-none'
            title={t('networkStats.participationRate')}
            metricFontSize='text-subtitle3'
            metric='---'
          />
        </Tooltip>
      ) : (
        <NetworkStatBlock
          className='border-none'
          title={t('networkStats.participationRate')}
          status={status}
          metricFontSize='text-subtitle3'
          metric={`${rate}%`}
        />
      )}
    </div>
  )
}

export default NetworkStats
