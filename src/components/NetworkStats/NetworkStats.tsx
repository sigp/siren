import { useRecoilValue } from 'recoil'
import { beaconHealthResult, validatorHealthResult } from '../../recoil/atoms';
import NetworkStatBlock from './NetworkStatBlock'
import { useTranslation } from 'react-i18next'
import secondsToShortHand from '../../utilities/secondsToShortHand';
import { selectGenesisBlock } from '../../recoil/selectors/selectGenesisBlock';
import Spinner from '../Spinner/Spinner';
import moment from 'moment';
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo';
import formatAtHeadSlotStatus from '../../utilities/formatAtHeadSlotStatus';
import NetworkPeerSpeedometer from '../NetworkPeerSpeedometer/NetworkPeerSpeedometer';

export const NetworkStatsFallback = () => (
  <div className="w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex items-center justify-center">
    <Spinner/>
  </div>
)

const NetworkStats = () => {
  const { t } = useTranslation()
  const {headSlot} = useRecoilValue(selectBeaconSyncInfo)
  const validatorHealth = useRecoilValue(validatorHealthResult)
  const beaconHealth = useRecoilValue(beaconHealthResult)
  const genesisTime = useRecoilValue(selectGenesisBlock)

  const atHeadSlot = genesisTime && headSlot ? headSlot - Math.floor((moment().unix() - (genesisTime + 6)) / 12) : undefined
  const headSlotStatus = formatAtHeadSlotStatus(atHeadSlot)

  const validatorUpTime = secondsToShortHand(validatorHealth?.app_uptime || 0)
  const beaconUpTime = secondsToShortHand(beaconHealth?.app_uptime || 0)

  return (
    <div className='w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex'>
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
      <NetworkPeerSpeedometer/>
      <NetworkStatBlock
        title={t('networkStats.participationRate')}
        status='bg-success'
        metricFontSize='text-subtitle3'
        metric='98%'
      />
    </div>
  )
}

export default NetworkStats
