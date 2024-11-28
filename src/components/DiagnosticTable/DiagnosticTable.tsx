import { FC } from 'react'
import AlertInfo, { AlertInfoProps } from '../AlertInfo/AlertInfo'
import HardwareInfo, { HardwareInfoProps } from './HardwareInfo'
import LogsInfo, { LogsInfoProps } from './LogsInfo'

export interface DiagnosticTableProps extends HardwareInfoProps, AlertInfoProps, LogsInfoProps {}

const DiagnosticTable: FC<DiagnosticTableProps> = ({ syncData, beanHealth, metrics, bnSpec }) => {
  return (
    <div className='flex-1 flex flex-col space-y-4 md:space-y-0 md:flex-row mt-2 w-full'>
      <HardwareInfo syncData={syncData} beanHealth={beanHealth} />
      <LogsInfo metrics={metrics} />
      <AlertInfo bnSpec={bnSpec} metrics={metrics} syncData={syncData} />
    </div>
  )
}

export default DiagnosticTable
