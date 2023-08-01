import { StatusColor } from './index'
import { DiagnosticRate } from '../constants/enums'

export type HealthDiagnosticResult = {
  app_uptime: number
  cpu_cores: number
  cpu_threads: number
  disk_bytes_free: number
  disk_bytes_total: number
  global_cpu_frequency: number
  host_name: string
  kernel_version: string
  network_bytes_total_received: number
  network_bytes_total_transmit: number
  network_name: string
  nat_open: boolean
  os_version: string
  sys_loadavg_1: number // CPU Usage percentage data
  sys_loadavg_5: number // CPU Usage percentage data
  sys_loadavg_15: number // CPU Usage percentage data
  system_name: string
  system_uptime: number
  free_memory: number // RAM Memory data
  total_memory: number // RAM Memory data
  used_memory: number // RAM Memory data
}

export type BeaconSyncResult = {
  head_slot: number
  is_optimistic: boolean
  is_syncing: boolean
  sync_distance: number
}

export type ValidatorSyncResult = {
  head_block_number: string
  head_block_timestamp: string
  latest_cached_block_number: string
  latest_cached_block_timestamp: string
  voting_target_timestamp: string
  eth1_node_sync_status_percentage: number
  lighthouse_is_cached_and_ready: boolean
}

export type ValidatorSyncInfo = {
  headSlot: number
  headTimestamp: string
  cachedHeadSlot: number
  cachedHeadTimestamp: string
  votingTimestamp: string
  syncPercentage: number
  isReady: boolean
}

export type BeaconSyncInfo = {
  headSlot: number
  slotDistance: number
  beaconPercentage: number
  isSyncing: boolean
  beaconSyncTime: number // Time in seconds
}

export type Diagnostics = {
  totalDiskSpace: number
  diskUtilization: number
  totalDiskFree: number
  diskStatus: StatusColor
  totalMemory: number
  memoryUtilization: number
  frequency?: string
  ramStatus: StatusColor
  cpuStatus: StatusColor
  cpuUtilization: string
  networkName?: string
  natOpen: boolean
  uptime: string
  healthCondition: DiagnosticRate
  overallHealthStatus: StatusColor
}
