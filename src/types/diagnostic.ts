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
