import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import Typography from '../Typography/Typography'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '../../hooks/useMediaQuery';

const HardwareInfo = () => {
  const { t } = useTranslation()
  const {
    totalDiskSpace,
    diskUtilization,
    diskStatus,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuUtilization,
    cpuStatus,
    frequency
  } = useDeviceDiagnostics()

  const isMobile = useMediaQuery('(max-width: 425px)')

  const size = isMobile ? 'health' : 'md';

  return (
    <div className='h-full w-full flex flex-col xl:min-w-316'>
      <div className='w-full h-12 border flex border-style500'>
        <div className='flex-1 p-2 flex items-center justify-center cursor-pointer'>
          <Typography
            type='text-caption2'
            className='xl:text-caption1'
            color='text-primary'
            darkMode='dark:text-white'
            isBold
          >
            {t('hardwareInfo.usage')}
          </Typography>
        </div>
        <div className='flex-1 p-2 flex items-center justify-center cursor-pointer'>
          <Typography type='text-caption2' className='xl:text-caption1' color='text-dark500'>
            {t('hardwareInfo.diagnostics')}
          </Typography>
        </div>
      </div>
      <DiagnosticCard
        title={t('disk')}
        maxHeight='flex-1'
        size={size}
        border='border-t-0 border-style500'
        metric={`${totalDiskSpace.toFixed(1)}GB`}
        subTitle={t('utilization', { percent: diskUtilization })}
        status={diskStatus}
      />
      <DiagnosticCard
        title={t('cpu')}
        maxHeight='flex-1'
        size={size}
        border='border-t-0 border-style500'
        metric={frequency ? frequency : ' '}
        subTitle={t('utilization', { percent: cpuUtilization })}
        status={cpuStatus}
      />
      <DiagnosticCard
        title={t('ram')}
        maxHeight='flex-1'
        size={size}
        border='border-t-0 border-style500'
        metric={`${totalMemory.toFixed(1)}GB`}
        subTitle={t('utilization', { percent: memoryUtilization })}
        status={ramStatus}
      />
    </div>
  )
}

export default HardwareInfo
