import { FC } from 'react'
import AlertInfo, { AlertInfoProps } from '../AlertInfo/AlertInfo'
import HardwareInfo, { HardwareInfoProps } from './HardwareInfo'
import LogsInfo, { LogsInfoProps } from './LogsInfo'

export interface DiagnosticTableProps extends HardwareInfoProps, AlertInfoProps, LogsInfoProps {}

const DiagnosticTable: FC<DiagnosticTableProps> = ({
  syncData,
  beanHealth,
  logMetrics,
  bnSpec,
  priorityLogs,
}) => {
  return (
    <div className='h-full flex flex-col space-y-2 md:space-y-0 md:flex-row w-full min-h-0 pb-1'>
      <div className='flex-1 min-h-0'>
        <HardwareInfo syncData={syncData} beanHealth={beanHealth} />
      </div>
      <div className='flex-1 min-h-0'>
        <LogsInfo logMetrics={logMetrics} />
      </div>
      <div className='flex-1 min-h-0'>
        <AlertInfo bnSpec={bnSpec} priorityLogs={priorityLogs} syncData={syncData} />
      </div>
    </div>
  )
}

export default DiagnosticTable
