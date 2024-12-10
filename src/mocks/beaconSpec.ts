import { DiagnosticRate } from '../constants/enums'
import { StatusColor } from '../types'

export const mockBeaconSpec = {
  CONFIG_NAME: 'mock-name',
  DEPOSIT_CHAIN_ID: 'mock-id',
  DEPOSIT_CONTRACT_ADDRESS: 'mock-address',
  DEPOSIT_NETWORK_ID: 'mock-network-id',
  SECONDS_PER_SLOT: '12',
  SLOTS_PER_EPOCH: '32',
}

export const mockDiagnostics = {
  totalDiskSpace: 123,
  diskUtilization: 0,
  totalDiskFree: 123,
  diskStatus: {
    synced: StatusColor.ERROR,
    syncing: StatusColor.SUCCESS,
  },
  totalMemory: 123,
  memoryUtilization: 0,
  frequency: '100',
  ramStatus: StatusColor.SUCCESS,
  cpuStatus: StatusColor.SUCCESS,
  cpuUtilization: '6.0',
  networkName: 'example',
  natOpen: false,
  uptime: {
    beacon: '10M 0S',
    validator: '10M 0S',
  },
  healthCondition: {
    synced: DiagnosticRate.POOR,
    syncing: DiagnosticRate.GOOD,
  },
  overallHealthStatus: {
    synced: StatusColor.ERROR,
    syncing: StatusColor.SUCCESS,
  },
}
