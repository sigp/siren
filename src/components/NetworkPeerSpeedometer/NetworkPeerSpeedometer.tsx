import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer'
import { UiMode } from '../../constants/enums';
import { useRecoilValue } from 'recoil';
import { beaconNodeEndpoint, uiMode } from '../../recoil/atoms';
import { useEffect, useState } from 'react';
import { fetchPeerCount } from '../../api/beacon';
import usePollingInterval from '../../hooks/usePollingInterval';
import Typography from '../Typography/Typography';
import { useTranslation } from 'react-i18next';
import { secondsInSlot } from '../../constants/constants';

const NetworkPeerSpeedometer = () => {
  const { t } = useTranslation()
  const mode = useRecoilValue(uiMode)
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const [peers, setPeers] = useState<number>(0)

  const fetchPeers = async () => {
    if(!beaconEndpoint) return;

    try {
      const {data} = await fetchPeerCount(beaconEndpoint);

      setPeers(Number(data.data.connected))
    } catch (e) {
      console.error(e)
    }
  }

  usePollingInterval(fetchPeers, secondsInSlot * 2000)

  useEffect(() => {
    if(beaconEndpoint) {
      void fetchPeers()
    }
  }, [beaconEndpoint])

  return (
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
            {peers}
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
            value={peers}
            maxValue={100}
            textColor={'transparent'}
          />
        </div>
      </div>
    </div>
  )
}

export default NetworkPeerSpeedometer;