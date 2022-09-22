import Typography from '../Typography/Typography'
import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer'
import { useRecoilValue } from 'recoil'
import { uiMode } from '../../recoil/atoms'
import { UiMode } from '../../constants/enums'
import NetworkStatBlock from './NetworkStatBlock'

const NetworkStats = () => {
  const mode = useRecoilValue(uiMode)
  return (
    <div className='w-full h-18 lg:h-16 xl:h-14 border-style500 shadow flex'>
      <NetworkStatBlock title='Process Uptime' subTitle='Validator' metric='15.6 HR' />
      <NetworkStatBlock title='Process Uptime' subTitle='Beacon Chain' metric='0.3 HR' />
      <NetworkStatBlock
        title='AT Head Slot'
        status='bg-warning'
        metricFontSize='text-subtitle3'
        metric='-2'
      />
      <div className='relative py-2 px-4 h-full w-52 border-r-style500'>
        <Typography type='text-tiny' className='uppercase' isBold darkMode='dark:text-white'>
          Connected Peers
        </Typography>
        <div className='flex items-center space-x-4 pt-1'>
          <Typography color='text-dark300' type='text-caption2'>
            Node
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
        title='Participation Rate'
        status='bg-success'
        metricFontSize='text-subtitle3'
        metric='98%'
      />
    </div>
  )
}

export default NetworkStats
