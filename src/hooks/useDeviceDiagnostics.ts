import { useRecoilValue } from 'recoil'
import { selectHeathDiagnostic } from '../recoil/selectors/selectHeathDiagnostic'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusType } from '../types'
import { Diagnostics } from '../types/diagnostic'
import { DiagnosticRate } from '../constants/enums'

const useDeviceDiagnostics = (): Diagnostics => {
  const { disk_bytes_free, disk_bytes_total, used_memory, total_memory, free_memory, sys_loadavg_1, app_uptime } =
    useRecoilValue(selectHeathDiagnostic)

  const diskUtilization = useMemo(() => {
    if (!disk_bytes_total || !disk_bytes_free) {
      return 0
    }

    return Math.round(getPercentage(disk_bytes_total - disk_bytes_free, disk_bytes_total))
  }, [disk_bytes_total, disk_bytes_free])

  const totalDiskSpace = formatGigBytes(disk_bytes_total)
  const totalDiskFree = formatGigBytes(disk_bytes_free)

  const diskStatus = useMemo<StatusType>(
    () =>
      totalDiskFree > 300
        ? 'bg-success'
        : totalDiskFree > 200 && totalDiskFree < 300
        ? 'bg-warning'
        : 'bg-error',
    [totalDiskFree],
  )

  const memoryUtilization = Math.round(getPercentage(used_memory, total_memory))
  const totalMemoryFree = formatGigBytes(free_memory)
  const totalMemory = formatGigBytes(total_memory)

  const ramStatus = useMemo<StatusType>(
    () =>
      totalMemoryFree > 15
        ? 'bg-success'
        : totalMemoryFree > 4 && totalMemoryFree < 15
        ? 'bg-warning'
        : 'bg-error',
    [totalMemoryFree],
  )

  const cpuUtilization = sys_loadavg_1.toFixed(1)

  const cpuStatus = useMemo<StatusType>(
    () =>
      sys_loadavg_1 >= 2.5
        ? 'bg-success'
        : sys_loadavg_1 > 1.5 && sys_loadavg_1 < 2.4
        ? 'bg-warning'
        : 'bg-error',
    [sys_loadavg_1],
  )

  const overallHealth = [diskStatus, cpuStatus, ramStatus]

  const overallHealthStatus = overallHealth.includes('bg-error')
    ? 'bg-error'
    : overallHealth.includes('bg-warning')
    ? 'bg-warning'
    : 'bg-success'
  const healthCondition =
    overallHealthStatus === 'bg-error'
      ? DiagnosticRate.POOR
      : overallHealthStatus === 'bg-warning'
      ? DiagnosticRate.FAIR
      : DiagnosticRate.GOOD

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
    uptime: app_uptime,
    healthCondition,
    overallHealthStatus,
  }
}

export default useDeviceDiagnostics
