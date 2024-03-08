import { FC } from 'react';
import { useTranslation } from 'react-i18next'
import addSuffixString from '../../../utilities/addSuffixString'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import useDeviceDiagnostics from '../../hooks/useDeviceDiagnostics'
import { HealthDiagnosticResult } from '../../types/diagnostic';
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import DiagnosticSummaryCard from '../DiagnosticSummaryCard/DiagnosticSummaryCard'

export interface DeviceHealthProps {
  health: HealthDiagnosticResult
}

const DeviceHealth:FC<DeviceHealthProps> = ({health}) => {
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
    frequency,
  } = useDeviceDiagnostics(health)

  return (
    <div className='w-full md:h-24 flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-2'>
      <DiagnosticSummaryCard type={DiagnosticType.DEVICE} rate={DiagnosticRate.FAIR} />
      <DiagnosticCard
        size='health'
        title={t('disk')}
        metric={addSuffixString(Math.round(totalDiskSpace), 'GB')}
        subTitle={t('utilization', { percent: diskUtilization })}
        status={diskStatus}
      />
      <DiagnosticCard
        size='health'
        title={t('cpu')}
        metric={frequency ? addSuffixString(frequency, 'GHz') : ' '}
        subTitle={t('utilization', { percent: cpuUtilization })}
        status={cpuStatus}
      />
      <DiagnosticCard
        size='health'
        title={t('ram')}
        metric={addSuffixString(Math.round(totalMemory), 'GB')}
        subTitle={t('utilization', { percent: memoryUtilization })}
        status={ramStatus}
      />
    </div>
  )
}

export default DeviceHealth
