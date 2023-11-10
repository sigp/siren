import ReactSpeedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer'
import { UiMode } from '../../constants/enums'
import { useRecoilValue } from 'recoil'
import { uiMode, validatorPeerCount } from '../../recoil/atoms'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import Tooltip from '../ToolTip/Tooltip'
import { StatusColor } from '../../types'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import { useEffect } from 'react'
import { ALERT_ID } from '../../constants/constants'

const NetworkPeerSpeedometer = () => {
  const { t } = useTranslation()
  const mode = useRecoilValue(uiMode)
  const peers = useRecoilValue(validatorPeerCount)
  const { updateAlert } = useDiagnosticAlerts()

  useEffect(() => {
    if (!peers) return

    if (peers <= 50) {
      if (peers <= 20) {
        updateAlert({
          message: t('alert.peerCountLow', { type: t('alert.type.nodeValidator') }),
          subText: t('poor'),
          severity: StatusColor.ERROR,
          id: ALERT_ID.PEER_COUNT,
        })
        return
      }
      updateAlert({
        message: t('alert.peerCountMedium', { type: t('alert.type.nodeValidator') }),
        subText: t('fair'),
        severity: StatusColor.WARNING,
        id: ALERT_ID.PEER_COUNT,
      })
    }
  }, [peers])

  return (
    <Tooltip
      id='peerCount'
      maxWidth={200}
      text={t('networkStats.toolTips.peerCount')}
      className='relative py-6 md:py-2 px-4 h-full w-full md:w-52 border-b-style500 md:border-b-0 md:border-r-style500'
    >
      <div className='flex space-x-2'>
        <Typography type='text-tiny' isUpperCase isBold darkMode='dark:text-white'>
          {t('networkStats.connectedPeers')}
        </Typography>
        <i className='bi-info-circle text-caption1.5 text-dark400 dark:text-dark300' />
      </div>
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
            value={peers || 0}
            maxValue={100}
            textColor={'transparent'}
          />
        </div>
      </div>
    </Tooltip>
  )
}

export default NetworkPeerSpeedometer
