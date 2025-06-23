import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addSuffixString from '../../../utilities/addSuffixString'
import secondsToShortHand from '../../../utilities/secondsToShortHand'
import { DiagnosticType } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import useMetricHistory from '../../hooks/useMetricHistory'
import { StatusColor } from '../../types'
import { SyncData } from '../../types/beacon'
import { Diagnostics } from '../../types/diagnostic'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import Typography from '../Typography/Typography'

export interface HardwareInfoProps {
  syncData: SyncData
  beanHealth: Diagnostics
}

const HardwareInfo: FC<HardwareInfoProps> = ({ syncData, beanHealth }) => {
  const { t } = useTranslation()
  const {
    beaconSync: { beaconSyncTime, beaconPercentage, isSyncing },
    executionSync: { syncPercentage, isReady },
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
          <>
            <DiagnosticCard
              title={t('disk')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500'
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
              border='border-t-0 border-style500'
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
              border='border-t-0 border-style500'
              metric={addSuffixString(Math.round(totalMemory), 'GB')}
              subTitle={t('utilization', { percent: memoryUtilization })}
              status={ramStatus}
              chartData={ramHistory}
              chartColor='#A841D5'
              chartLabel='RAM Usage'
              iconType='ram'
            />
          </>
        )
      case DiagnosticType.NETWORK:
        return (
          <>
            <DiagnosticCard
              size={size}
              maxHeight='flex-1'
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
              size={size}
              maxHeight='flex-1'
              title='Ethereum Mainnet'
              metric=' '
              percent={syncPercentage}
              isBackground={false}
              subTitle={t('connectedStatus', { status: isReady ? t('inSync') : t('outOfSync') })}
            />
            <DiagnosticCard
              size={size}
              maxHeight='flex-1'
              title='Beacon Node'
              metric={Number(beaconSyncTime) === 0 ? ' ' : remainingBeaconTime}
              percent={Number(beaconPercentage)}
              isBackground={false}
              subTitle={t('connectedStatus', {
                status: Number(beaconPercentage) < 100 ? t('outOfSync') : t('inSync'),
              })}
            />
          </>
        )
    }
  }

  const viewDeviceInfo = () => setView(DiagnosticType.DEVICE)
  const viewNetworkInfo = () => setView(DiagnosticType.NETWORK)

  return (
    <div className='h-full w-full flex flex-col xl:min-w-316'>
      <div className='w-full h-12 flex items-center justify-between px-4 border-style500'>
        <div onClick={viewDeviceInfo} className='cursor-pointer'>
          <Typography
            type='text-caption1'
            color={isDeviceView ? 'text-primary' : 'text-dark500'}
            darkMode={isDeviceView ? 'dark:text-white' : undefined}
            isBold={isDeviceView}
          >
            {t('hardwareInfo.usage')}
          </Typography>
        </div>
        <div onClick={viewNetworkInfo} className='cursor-pointer'>
          <Typography
            type='text-tiny'
            className='uppercase @1600:text-caption1'
            color={isNetworkView ? 'text-primary' : 'text-dark400'}
            darkMode={isNetworkView ? 'dark:text-white' : undefined}
          >
            {t('hardwareInfo.diagnostics')}
          </Typography>
        </div>
      </div>
      {renderView()}
    </div>
  )
}

export default HardwareInfo
