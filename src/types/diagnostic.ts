export type HealthDiagnosticResult = {
  cpu_temp: number
  load_avg_fifteen: number // CPU Usage percentage data
  load_avg_five: number // CPU Usage percentage data
  load_avg_one: number // CPU Usage percentage data
  mem_free: number // RAM Memory data
  mem_total: number // RAM Memory data
  mem_used: number // RAM Memory data
  root_fs_avail: number // Disk Storage Size data
  root_fs_size: number // Disk Storage Size data
  uptime: number // Total Node-Client runtime
}

export type BeaconSyncResult = {
  head_slot: number
  is_optimistic: boolean
  is_syncing: boolean
  sync_distance: number
}

export type BeaconSyncInfo = {
  headSlot: number
  slotDistance: number
  beaconPercentage: number
  beaconSyncTime: number // Time in seconds
}
