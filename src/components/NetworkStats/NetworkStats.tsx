import Typography from '../Typography/Typography'
import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer'
import { useRecoilValue } from 'recoil'
import { beaconHealthResult, uiMode, validatorHealthResult } from '../../recoil/atoms';
import { UiMode } from '../../constants/enums'
import NetworkStatBlock from './NetworkStatBlock'
import { useTranslation } from 'react-i18next'
import secondsToShortHand from '../../utilities/secondsToShortHand';
import { selectGenesisBlock } from '../../recoil/selectors/selectGenesisBlock';
import Spinner from '../Spinner/Spinner';
import moment from 'moment';
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo';
import formatAtHeadSlotStatus from '../../utilities/formatAtHeadSlotStatus';

export const NetworkStatsFallback = () => (
  <div className="w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex items-center justify-center">
    <Spinner/>
  </div>
)

const NetworkStats = () => {
  const { t } = useTranslation()
  const mode = useRecoilValue(uiMode)
  const {headSlot} = useRecoilValue(selectBeaconSyncInfo)
  const validatorHealth = useRecoilValue(validatorHealthResult)
  const beaconHealth = useRecoilValue(beaconHealthResult)
  const genesisTime = useRecoilValue(selectGenesisBlock)

  const atHeadSlot = genesisTime && headSlot ? headSlot - Math.floor((moment().unix() - genesisTime) / 12) : undefined
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
        metric={atHeadSlot !== undefined ? String(atHeadSlot) : '---'}
      />
      <div className='relative py-2 px-4 h-full w-52 border-r-style500'>
        <Typography type='text-tiny' className='uppercase' isBold darkMode='dark:text-white'>
          {t('networkStats.connectedPeers')}
        </Typography>
        <div className='flex items-center space-x-4 pt-1'>
          <Typography color='text-dark300' type='text-caption2'>
            {t('node')}
          </Typography>
          <div className='absolute -bottom-6 right-0'>
            <Typography
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              darkMode='dark:text-white'
              type='text-caption2'
            >
              32
            </Typography>
            <ReactSpeedometer
              width={90}
              height={80}
              ringWidth={6}
              needleHeightRatio={0.4}
              segments={4}
              maxSegmentLabels={1}
              customSegmentLabels={[
                {
                  text: '50',
                  position: CustomSegmentLabelPosition.Outside,
                  color: mode === UiMode.LIGHT ? 'black' : 'white',
                },
                {},
                {},
                {},
              ]}
              needleColor='transparent'
              labelFontSize='6px'
              valueTextFontSize='9px'
              segmentColors={['tomato', 'gold', 'limegreen']}
              value={32}
              maxValue={100}
              textColor={'transparent'}
            />
          </div>
        </div>
      </div>
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
