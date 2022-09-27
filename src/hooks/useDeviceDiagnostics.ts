import { useRecoilValue } from 'recoil'
import { selectHeathDiagnostic } from '../recoil/selectors/selectHeathDiagnostic'
import { useMemo } from 'react'
import getPercentage from '../utilities/getPercentage'
import formatGigBytes from '../utilities/formatGigBytes'
import { StatusType } from '../types'

const useDeviceDiagnostics = () => {
  const { root_fs_avail, root_fs_size, mem_used, mem_total, mem_free, load_avg_one } =
    useRecoilValue(selectHeathDiagnostic)

  const diskUtilization = useMemo(() => {
    if (!root_fs_size || !root_fs_avail) {
      return 0
    }

    return Math.round(getPercentage(root_fs_size - root_fs_avail, root_fs_size))
  }, [root_fs_size, root_fs_avail])

  const totalDiskSpace = useMemo(() => formatGigBytes(root_fs_size), [root_fs_size])
  const totalDiskFree = useMemo(() => formatGigBytes(root_fs_avail), [root_fs_avail])
  const diskStatus = useMemo<StatusType>(
    () =>
      totalDiskFree > 300
        ? 'bg-success'
        : totalDiskFree > 200 && totalDiskFree < 300
        ? 'bg-warning'
        : 'bg-error',
    [totalDiskFree],
  )

  const memoryUtilization = useMemo(
    () => (mem_used && mem_total ? Math.round(getPercentage(mem_used, mem_total)) : 0),
    [mem_used, mem_total],
  )
  const totalMemoryFree = useMemo(() => formatGigBytes(mem_free), [mem_free])
  const totalMemory = useMemo(() => formatGigBytes(mem_total), [mem_total])

  const ramStatus = useMemo<StatusType>(
    () =>
      totalMemoryFree > 15
        ? 'bg-success'
        : totalDiskFree > 8 && totalDiskFree < 15
        ? 'bg-warning'
        : 'bg-error',
    [totalMemoryFree],
  )

  const cpuUtilization = useMemo(() => load_avg_one.toFixed(1), [load_avg_one])

  const cpuStatus = useMemo<StatusType>(
    () =>
      load_avg_one >= 2.5
        ? 'bg-success'
        : load_avg_one > 1.5 && load_avg_one < 2.4
        ? 'bg-warning'
        : 'bg-error',
    [load_avg_one],
  )

  return {
    totalDiskSpace,
    diskUtilization,
    diskStatus,
    totalMemory,
    memoryUtilization,
    ramStatus,
    cpuStatus,
    cpuUtilization,
  }
}

export default useDeviceDiagnostics
