import useDeviceDiagnostics from '../useDeviceDiagnostics'
import { renderHook } from '@testing-library/react-hooks'
import formatGigBytes from '../../utilities/formatGigBytes'
import { mockBeaconHealthResult } from '../../mocks/beaconHealthResult'
import { mockedRecoilValue } from '../../../test.helpers'

jest.mock('../../utilities/formatGigBytes', () => jest.fn())

const mockedFormatGigBytes = formatGigBytes as jest.MockedFn<typeof formatGigBytes>

describe('useDeviceDiagnostics', () => {
  it('should return default values', () => {
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current).toStrictEqual({
      cpuStatus: 'bg-success',
      cpuUtilization: '0.0',
      diskStatus: 'bg-error',
      diskUtilization: 0,
      frequency: 'undefined',
      healthCondition: 'POOR',
      memoryUtilization: 0,
      natOpen: false,
      networkName: undefined,
      overallHealthStatus: 'bg-error',
      ramStatus: 'bg-error',
      totalDiskFree: undefined,
      totalDiskSpace: undefined,
      totalMemory: undefined,
      uptime: '0M 0S',
    })
  })
  it('should return correct results', () => {
    mockedRecoilValue.mockReturnValueOnce(mockBeaconHealthResult)
    mockedFormatGigBytes.mockReturnValue(16.5)
    const { result } = renderHook(() => useDeviceDiagnostics())

    expect(result.current).toStrictEqual({
      totalDiskSpace: 16.5,
      diskUtilization: 28,
      totalDiskFree: 16.5,
      diskStatus: 'bg-error',
      totalMemory: 16.5,
      memoryUtilization: 99,
      frequency: '0',
      ramStatus: 'bg-error',
      cpuStatus: 'bg-success',
      cpuUtilization: '13.0',
      networkName: 'en0',
      natOpen: true,
      uptime: '3D 22H',
      healthCondition: 'POOR',
      overallHealthStatus: 'bg-error',
    })
  })
})
