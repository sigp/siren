import useDeviceDiagnostics from '../useDeviceDiagnostics'
import { renderHook } from '@testing-library/react-hooks'
import formatGigBytes from '../../utilities/formatGigBytes'
import { mockBeaconHealthResult } from '../../mocks/beaconHealthResult'
import { mockedRecoilValue } from '../../../test.helpers'
import { mockBeaconSyncResult } from '../../mocks/beaconSyncResults'
import clearAllMocks = jest.clearAllMocks
import { StatusColor } from '../../types'
jest.mock('../../utilities/formatGigBytes', () => jest.fn())

jest.mock('../useDiagnosticAlerts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    alerts: [],
    storeAlert: jest.fn(),
    updateAlert: jest.fn(),
    dismissAlert: jest.fn(),
    removeAlert: jest.fn(),
  })),
}))

const mockedFormatGigBytes = formatGigBytes as jest.MockedFn<typeof formatGigBytes>

describe('useDeviceDiagnostics', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should return default values', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current).toStrictEqual({
      cpuStatus: StatusColor.SUCCESS,
      cpuUtilization: '0.0',
      diskStatus: StatusColor.ERROR,
      diskUtilization: 0,
      frequency: 'undefined',
      healthCondition: 'POOR',
      memoryUtilization: 0,
      natOpen: false,
      networkName: undefined,
      overallHealthStatus: StatusColor.ERROR,
      ramStatus: StatusColor.ERROR,
      totalDiskFree: undefined,
      totalDiskSpace: undefined,
      totalMemory: undefined,
      uptime: '0M 0S',
    })
  })
  it('should return correct results', () => {
    mockedRecoilValue.mockReturnValueOnce(mockBeaconHealthResult)
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValue(16.5)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current).toStrictEqual({
      totalDiskSpace: 16.5,
      diskUtilization: 28,
      totalDiskFree: 16.5,
      diskStatus: StatusColor.ERROR,
      totalMemory: 16.5,
      memoryUtilization: 99,
      frequency: '0',
      ramStatus: StatusColor.ERROR,
      cpuStatus: StatusColor.SUCCESS,
      cpuUtilization: '13.0',
      networkName: 'en0',
      natOpen: true,
      uptime: '3D 22H',
      healthCondition: 'POOR',
      overallHealthStatus: StatusColor.ERROR,
    })
  })
  it('should return bg-warning for disk space if syncing', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconSyncResult, isSyncing: true })
    mockedFormatGigBytes.mockReturnValue(200)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.diskStatus).toBe(StatusColor.WARNING)
  })
  it('should return bg-success for disk space if syncing', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValue(200)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.diskStatus).toBe(StatusColor.SUCCESS)
  })
  it('should return bg-success for ram status', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    mockedFormatGigBytes.mockReturnValueOnce(8)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.ramStatus).toBe(StatusColor.SUCCESS)
  })
  it('should return bg-warning for ram status', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    mockedFormatGigBytes.mockReturnValueOnce(6)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.ramStatus).toBe(StatusColor.WARNING)
  })
  it('should return bg-warning for cpu status', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconHealthResult, sys_loadavg_5: 85 })
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValue(4)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.cpuStatus).toBe(StatusColor.WARNING)
  })
  it('should return bg-error for cpu status', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconHealthResult, sys_loadavg_5: 95 })
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValue(4)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.cpuStatus).toBe(StatusColor.ERROR)
  })
  it('should return correct overall status', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconHealthResult, sys_loadavg_5: 85 })
    mockedRecoilValue.mockReturnValueOnce(mockBeaconSyncResult)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    mockedFormatGigBytes.mockReturnValueOnce(400)
    mockedFormatGigBytes.mockReturnValueOnce(400)
    mockedFormatGigBytes.mockReturnValueOnce(4)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current.overallHealthStatus).toStrictEqual(StatusColor.WARNING)
  })
})
