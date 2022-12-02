import { useRecoilValue } from 'recoil'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusType } from '../types'
import { Diagnostics } from '../types/diagnostic'
import { DiagnosticRate } from '../constants/enums'
import secondsToShortHand from '../utilities/secondsToShortHand'
import { beaconHealthResult } from '../recoil/atoms'

const useDeviceDiagnostics = (): Diagnostics => {
  const result = useRecoilValue(beaconHealthResult)
  const {
    disk_bytes_free = 0,
    disk_bytes_total = 0,
    used_memory = 0,
    total_memory = 0,
    free_memory = 0,
    sys_loadavg_1 = 0,
    app_uptime = 0,
    network_name,
    nat_open = false,
    global_cpu_frequency,
  } = result || {}

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
    frequency: String(global_cpu_frequency),
    ramStatus,
    cpuStatus,
    cpuUtilization,
    networkName: network_name,
    natOpen: nat_open,
    uptime: secondsToShortHand(app_uptime || 0),
    healthCondition,
    overallHealthStatus,
  }
}

export default useDeviceDiagnostics
