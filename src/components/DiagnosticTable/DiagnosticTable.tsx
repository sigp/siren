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
    <div className='h-full flex flex-col space-y-2 md:space-y-0 md:flex-row w-full min-h-0 overflow-hidden'>
      <HardwareInfo syncData={syncData} beanHealth={beanHealth} />
      <LogsInfo logMetrics={logMetrics} />
      <AlertInfo bnSpec={bnSpec} priorityLogs={priorityLogs} syncData={syncData} />
    </div>
  )
}

export default DiagnosticTable
