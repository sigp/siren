import HardwareInfo from './HardwareInfo'
import LogsInfo from './LogsInfo'
import AlertInfo from './AlertInfo'
import { Suspense } from 'react';
import TableColumnFallback from './TableColumnFallback';

const DiagnosticTable = () => {
  return (
    <div className='flex-1 flex mt-2 w-full'>
      <Suspense fallback={<TableColumnFallback size="lg"/>}>
        <HardwareInfo />
      </Suspense>
      <LogsInfo />
      <AlertInfo />
    </div>
  )
}

export default DiagnosticTable
