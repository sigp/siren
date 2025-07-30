import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addSuffixString from '../../../utilities/addSuffixString'
import formatAtHeadSlotStatus from '../../../utilities/formatAtHeadSlotStatus'
import secondsToShortHand from '../../../utilities/secondsToShortHand'
import { DiagnosticType } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import useMetricHistory from '../../hooks/useMetricHistory'
import { StatusColor } from '../../types'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import { Diagnostics } from '../../types/diagnostic'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import Typography from '../Typography/Typography'

export interface HardwareInfoProps {
  syncData: SyncData
  beanHealth: Diagnostics
  bnSpec: BeaconNodeSpecResults
}

const HardwareInfo: FC<HardwareInfoProps> = ({ syncData, beanHealth, bnSpec }) => {
  const { t } = useTranslation()
  const {
    beaconSync: { beaconSyncTime, beaconPercentage, isSyncing, headSlot, currentEpoch, syncDistance },
  } = syncData
  const [view, setView] = useState<DiagnosticType>(DiagnosticType.DEVICE)
  const {
    diskStatus,
    totalDiskSpace,
    diskUtilization,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuUtilization,
    cpuStatus,
    frequency,
    networkName,
    natOpen,
  } = beanHealth

  // Get historical data for charts
  const { cpuHistory, ramHistory, diskHistory } = useMetricHistory(
    cpuUtilization,
    memoryUtilization,
    diskUtilization,
    0,
    0,
    0,
  )

  const diskData = isSyncing ? diskStatus.syncing : diskStatus.synced
  const remainingBeaconTime = secondsToShortHand(Number(beaconSyncTime) || 0)
  
  // Calculate slot information
  const { SLOTS_PER_EPOCH } = bnSpec
  const currentSlotInEpoch = headSlot % SLOTS_PER_EPOCH
  const slotInfo = `Slot ${currentSlotInEpoch}/${SLOTS_PER_EPOCH} • Epoch ${currentEpoch}`
  
  // Calculate sync status using the same logic as the header
  const headSlotStatus = formatAtHeadSlotStatus(syncDistance)
  const getSyncStatusText = () => {
    switch (headSlotStatus) {
      case StatusColor.SUCCESS:
        return t('synced')
      case StatusColor.WARNING:
        return t('syncing')
      case StatusColor.ERROR:
        return t('outOfSync')
      default:
        return t('unknown')
    }
  }

  const isMobile = useMediaQuery('(max-width: 425px)')

  const size = isMobile ? 'health' : 'md'
  const isDeviceView = view === DiagnosticType.DEVICE
  const isNetworkView = view === DiagnosticType.NETWORK

  const metric = networkName
    ? natOpen
      ? t('vcHealthCheck.natOpen')
      : t('vcHealthCheck.natClosed')
    : undefined

  const renderView = () => {
    switch (view) {
      case DiagnosticType.DEVICE:
        return (
          <div className='flex flex-col h-full'>
            <DiagnosticCard
              title={t('disk')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500 border-b border-b-style500'
              metric={addSuffixString(Math.round(totalDiskSpace), 'GB')}
              subTitle={t('utilization', { percent: diskUtilization })}
              status={diskData}
              chartData={diskHistory}
              chartColor='#5E41D5'
              chartLabel='Disk Usage'
              iconType='disk'
            />
            <DiagnosticCard
              title={t('cpu')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500 border-b border-b-style500'
              metric={frequency ? addSuffixString(frequency, 'GHz') : ' '}
              subTitle={t('utilization', { percent: cpuUtilization })}
              status={cpuStatus}
              chartData={cpuHistory}
              chartColor='#7C5FEB'
              chartLabel='CPU Usage'
              iconType='cpu'
            />
            <DiagnosticCard
              title={t('ram')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500 border-b border-b-style500'
              metric={addSuffixString(Math.round(totalMemory), 'GB')}
              subTitle={t('utilization', { percent: memoryUtilization })}
              status={ramStatus}
              chartData={ramHistory}
              chartColor='#A841D5'
              chartLabel='RAM Usage'
              iconType='ram'
            />
          </div>
        )
      case DiagnosticType.NETWORK:
        return (
          <div className='flex flex-col h-full'>
            <DiagnosticCard
              size={size}
              maxHeight='flex-1'
              title={t('network')}
              isBackground={false}
              metricTextSize='text-caption2'
              metric={metric?.toUpperCase()}
              subTitleHighlightColor='bg-primary/10 border border-primary/20'
              border='border-t-0 border-style500 border-b border-b-style500'
              subTitle={
                networkName
                  ? t('vcHealthCheck.networkName', { network: networkName })
                  : t('networkUnavailable')
              }
              status={natOpen ? StatusColor.SUCCESS : StatusColor.DARK}
              iconType='network'
              chartColor='#3B82F6'
            />
            <DiagnosticCard
              size={size}
              maxHeight='flex-1'
              title='Beacon Node'
              metric={getSyncStatusText()}
              percent={Number(beaconPercentage)}
              isBackground={false}
              border='border-t-0 border-style500 border-b border-b-style500'
              subTitle={slotInfo}
              status={headSlotStatus}
              iconType='beacon'
              chartColor='#10B981'
            />
          </div>
        )
    }
  }

  const viewDeviceInfo = () => setView(DiagnosticType.DEVICE)
  const viewNetworkInfo = () => setView(DiagnosticType.NETWORK)

  return (
    <div className='h-full w-full flex flex-col xl:min-w-316'>
      <div className='w-full h-12 border items-center flex justify-between px-4 border-style500 flex-shrink-0'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          Hardware
        </Typography>
        <div className='flex items-center gap-1'>
          <div
            onClick={viewDeviceInfo}
            className='cursor-pointer'
          >
            <Typography
              type='text-tiny'
              className='uppercase @1600:text-caption1'
              color={isDeviceView ? 'text-primary' : 'text-dark400'}
              darkMode={isDeviceView ? 'dark:text-white' : undefined}
            >
              Usage
            </Typography>
          </div>
          <Typography
            type='text-tiny'
            className='text-dark400'
          >
            |
          </Typography>
          <div
            onClick={viewNetworkInfo}
            className='cursor-pointer'
          >
            <Typography
              type='text-tiny'
              className='uppercase @1600:text-caption1'
              color={isNetworkView ? 'text-primary' : 'text-dark400'}
              darkMode={isNetworkView ? 'dark:text-white' : undefined}
            >
              Diagnostics
            </Typography>
          </div>
        </div>
      </div>
      <div className='flex-1 min-h-0'>{renderView()}</div>
    </div>
  )
}

export default HardwareInfo
