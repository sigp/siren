import { useRecoilValue } from 'recoil'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusType } from '../types'
import { Diagnostics } from '../types/diagnostic'
import { DiagnosticRate } from '../constants/enums'
import secondsToShortHand from '../utilities/secondsToShortHand'
import { beaconHealthResult } from '../recoil/atoms'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'

const useDeviceDiagnostics = (): Diagnostics => {
  const result = useRecoilValue(beaconHealthResult)
  const { isSyncing } = useRecoilValue(selectBeaconSyncInfo)

  const {
    disk_bytes_free = 0,
    disk_bytes_total = 0,
    used_memory = 0,
    total_memory = 0,
    sys_loadavg_5 = 0,
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

  const diskStatus = useMemo<StatusType>(() => {
    const bigFree = isSyncing ? 300 : 100
    const midFree = isSyncing ? 200 : 50

    return totalDiskFree > bigFree
      ? 'bg-success'
      : totalDiskFree >= midFree && totalDiskFree < bigFree
      ? 'bg-warning'
      : 'bg-error'
  }, [totalDiskFree, isSyncing])

  const memoryUtilization = Math.round(getPercentage(used_memory, total_memory))
  const totalMemory = formatGigBytes(total_memory)
  const usedMemory = formatGigBytes(used_memory)

  const totalMemoryFree = totalMemory - usedMemory

  const ramStatus = useMemo<StatusType>(
    () =>
      totalMemoryFree >= 3
        ? 'bg-success'
        : totalMemoryFree > 1 && totalMemoryFree < 3
        ? 'bg-warning'
        : 'bg-error',
    [totalMemoryFree],
  )

  const cpuUtilization = sys_loadavg_5.toFixed(1)

  const cpuStatus = useMemo<StatusType>(
    () =>
      sys_loadavg_5 <= 80
        ? 'bg-success'
        : sys_loadavg_5 > 80 && sys_loadavg_5 < 90
        ? 'bg-warning'
        : 'bg-error',
    [sys_loadavg_5],
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
