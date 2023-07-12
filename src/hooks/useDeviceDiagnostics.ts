import { useRecoilValue } from 'recoil'
import { useEffect, useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusColor } from '../types'
import { Diagnostics } from '../types/diagnostic'
import { DiagnosticRate } from '../constants/enums'
import secondsToShortHand from '../utilities/secondsToShortHand'
import { beaconHealthResult } from '../recoil/atoms'
import { selectBeaconSyncInfo } from '../recoil/selectors/selectBeaconSyncInfo'
import useDiagnosticAlerts from './useDiagnosticAlerts'
import { useTranslation } from 'react-i18next'
import { ALERT_ID } from '../constants/constants'

const useDeviceDiagnostics = (): Diagnostics => {
  const { t } = useTranslation()
  const result = useRecoilValue(beaconHealthResult)
  const { isSyncing } = useRecoilValue(selectBeaconSyncInfo)
  const { storeAlert, removeAlert } = useDiagnosticAlerts()

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

  useEffect(() => {
    if (result?.nat_open) {
      removeAlert(ALERT_ID.NAT)
      return
    }

    storeAlert({
      id: ALERT_ID.NAT,
      message: t('alert.natClosedStatus', { type: t('alert.type.network') }),
      subText: t('poor'),
      severity: StatusColor.ERROR,
    })
  }, [result?.nat_open])

  const diskUtilization = useMemo(() => {
    if (!disk_bytes_total || !disk_bytes_free) {
      return 0
    }

    return Math.round(getPercentage(disk_bytes_total - disk_bytes_free, disk_bytes_total))
  }, [disk_bytes_total, disk_bytes_free])

  const totalDiskSpace = formatGigBytes(disk_bytes_total)
  const totalDiskFree = formatGigBytes(disk_bytes_free)

  const diskStatus = useMemo<StatusColor>(() => {
    const bigFree = isSyncing ? 300 : 100
    const midFree = isSyncing ? 200 : 50

    return totalDiskFree > bigFree
      ? StatusColor.SUCCESS
      : totalDiskFree >= midFree && totalDiskFree < bigFree
      ? StatusColor.WARNING
      : StatusColor.ERROR
  }, [totalDiskFree, isSyncing])

  const memoryUtilization = Math.round(getPercentage(used_memory, total_memory))
  const totalMemory = formatGigBytes(total_memory)
  const usedMemory = formatGigBytes(used_memory)

  const totalMemoryFree = totalMemory - usedMemory

  const ramStatus = useMemo<StatusColor>(
    () =>
      totalMemoryFree >= 3
        ? StatusColor.SUCCESS
        : totalMemoryFree > 1 && totalMemoryFree < 3
        ? StatusColor.WARNING
        : StatusColor.ERROR,
    [totalMemoryFree],
  )

  const cpuUtilization = sys_loadavg_5.toFixed(1)

  const cpuStatus = useMemo<StatusColor>(
    () =>
      sys_loadavg_5 <= 80
        ? StatusColor.SUCCESS
        : sys_loadavg_5 > 80 && sys_loadavg_5 < 90
        ? StatusColor.WARNING
        : StatusColor.ERROR,
    [sys_loadavg_5],
  )

  const overallHealth = [diskStatus, cpuStatus, ramStatus]

  const overallHealthStatus = overallHealth.includes(StatusColor.ERROR)
    ? StatusColor.ERROR
    : overallHealth.includes(StatusColor.WARNING)
    ? StatusColor.WARNING
    : StatusColor.SUCCESS
  const healthCondition =
    overallHealthStatus === StatusColor.ERROR
      ? DiagnosticRate.POOR
      : overallHealthStatus === StatusColor.WARNING
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
