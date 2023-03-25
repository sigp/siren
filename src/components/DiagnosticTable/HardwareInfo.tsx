import Typography from '../Typography/Typography'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useRecoilValue } from 'recoil'
import { selectBeaconSyncInfo } from '../../recoil/selectors/selectBeaconSyncInfo'
import { selectValidatorSyncInfo } from '../../recoil/selectors/selectValidatorSyncInfo'
import secondsToShortHand from '../../utilities/secondsToShortHand'
import { useState } from 'react'
import { DiagnosticType } from '../../constants/enums'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import addSuffixString from '../../utilities/addSuffixString'
import { StatusColor } from '../../types'

const HardwareInfo = () => {
  const { t } = useTranslation()
  const [view, setView] = useState<DiagnosticType>(DiagnosticType.DEVICE)
  const { beaconPercentage, beaconSyncTime } = useRecoilValue(selectBeaconSyncInfo)
  const { isReady, syncPercentage } = useRecoilValue(selectValidatorSyncInfo)
  const {
    totalDiskSpace,
    diskUtilization,
    diskStatus,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuUtilization,
    cpuStatus,
    frequency,
    networkName,
    natOpen,
  } = useDeviceDiagnostics()
  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

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
              status={diskStatus}
            />
            <DiagnosticCard
              title={t('cpu')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500'
              metric={frequency ? addSuffixString(frequency, 'GHz') : ' '}
              subTitle={t('utilization', { percent: cpuUtilization })}
              status={cpuStatus}
            />
            <DiagnosticCard
              title={t('ram')}
              maxHeight='flex-1'
              size={size}
              border='border-t-0 border-style500'
              metric={addSuffixString(Math.round(totalMemory), 'GB')}
              subTitle={t('utilization', { percent: memoryUtilization })}
              status={ramStatus}
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
              metric={beaconSyncTime === 0 ? ' ' : remainingBeaconTime}
              percent={beaconPercentage}
              isBackground={false}
              subTitle={t('connectedStatus', {
                status: beaconPercentage < 100 ? t('outOfSync') : t('inSync'),
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
      <div className='w-full h-12 border flex border-style500'>
        <div
          onClick={viewDeviceInfo}
          className='flex-1 p-2 flex items-center justify-center cursor-pointer'
        >
          <Typography
            type='text-caption2'
            className='xl:text-caption1'
            color={isDeviceView ? 'text-primary' : 'text-dark500'}
            darkMode={isDeviceView ? 'dark:text-white' : undefined}
            isBold={isDeviceView}
          >
            {t('hardwareInfo.usage')}
          </Typography>
        </div>
        <div
          onClick={viewNetworkInfo}
          className='flex-1 p-2 flex items-center justify-center cursor-pointer'
        >
          <Typography
            isBold={isNetworkView}
            type='text-caption2'
            className='xl:text-caption1'
            color={isNetworkView ? 'text-primary' : 'text-dark500'}
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
