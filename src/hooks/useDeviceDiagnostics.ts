import { useRecoilValue } from 'recoil'
import { selectHeathDiagnostic } from '../recoil/selectors/selectHeathDiagnostic'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusType } from '../types'
import { Diagnostics } from '../types/diagnostic';

const useDeviceDiagnostics = ():Diagnostics => {
  const { root_fs_avail, root_fs_size, mem_used, mem_total, mem_free, load_avg_one, uptime } =
    useRecoilValue(selectHeathDiagnostic)

  const diskUtilization = useMemo(() => {
    if (!root_fs_size || !root_fs_avail) {
      return 0
    }

    return Math.round(getPercentage(root_fs_size - root_fs_avail, root_fs_size))
  }, [root_fs_size, root_fs_avail])

  const totalDiskSpace = formatGigBytes(root_fs_size)
  const totalDiskFree = formatGigBytes(root_fs_avail)

  const diskStatus = useMemo<StatusType>(
    () =>
      totalDiskFree > 300
        ? 'bg-success'
        : totalDiskFree > 200 && totalDiskFree < 300
        ? 'bg-warning'
        : 'bg-error',
    [totalDiskFree],
  )

  const memoryUtilization = Math.round(getPercentage(mem_used, mem_total))
  const totalMemoryFree = formatGigBytes(mem_free)
  const totalMemory = formatGigBytes(mem_total)

  const ramStatus = useMemo<StatusType>(
    () =>
      totalMemoryFree > 15
        ? 'bg-success'
        : totalMemoryFree > 4 && totalMemoryFree < 15
        ? 'bg-warning'
        : 'bg-error',
    [totalMemoryFree],
  )

  const cpuUtilization = load_avg_one.toFixed(1)

  const cpuStatus = useMemo<StatusType>(
    () =>
      load_avg_one >= 2.5
        ? 'bg-success'
        : load_avg_one > 1.5 && load_avg_one < 2.4
        ? 'bg-warning'
        : 'bg-error',
    [load_avg_one],
  )

  const overallHealth = [diskStatus, cpuStatus, ramStatus];

  const overallHealthStatus = overallHealth.includes('bg-error') ? 'bg-error' : overallHealth.includes('bg-warning') ? 'bg-warning' : 'bg-success';
  const healthCondition = overallHealthStatus === 'bg-error' ? 'Poor' : overallHealthStatus === 'bg-warning' ? 'Fair' : 'Good'

  return {
    totalDiskSpace,
    diskUtilization,
    totalDiskFree,
    diskStatus,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuStatus,
    cpuUtilization,
    uptime,
    healthCondition,
    overallHealthStatus
  }
}

export default useDeviceDiagnostics
