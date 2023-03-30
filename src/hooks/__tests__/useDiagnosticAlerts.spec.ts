import { renderHook } from '@testing-library/react-hooks'
import useDiagnosticAlerts from '../useDiagnosticAlerts'
import { Diagnostics } from '../../types/diagnostic'
import useDeviceDiagnostics from '../useDeviceDiagnostics'
import { mockedRecoilValue } from '../../../test.helpers'
import { StatusColor } from '../../types'

jest.mock('../useDeviceDiagnostics', () => jest.fn())

export const mockedUseDeviceDiagnostics = useDeviceDiagnostics as jest.MockedFn<
  typeof useDeviceDiagnostics
>

describe('useDiagnosticAlerts', () => {
  beforeEach(() => {
    mockedUseDeviceDiagnostics.mockReturnValue({ natOpen: false } as Diagnostics)
  })

  it('should not return peer count alert', () => {
    mockedRecoilValue.mockReturnValue(69)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.peerCountAlert).toBe(undefined)
  })

  it('should return undefined peer count alert', () => {
    mockedRecoilValue.mockReturnValue(undefined)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.peerCountAlert).toBe(undefined)
  })
  it('should return peer count low alert', () => {
    mockedRecoilValue.mockReturnValue(0)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.peerCountAlert).toStrictEqual({
      message: 'alert.peerCountLow',
      subText: 'poor',
      severity: StatusColor.ERROR,
    })
  })
  it('should return peer count medium alert', () => {
    mockedRecoilValue.mockReturnValue(35)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.peerCountAlert).toStrictEqual({
      message: 'alert.peerCountMedium',
      subText: 'fair',
      severity: StatusColor.WARNING,
    })
  })
  it('should return nat closed alert', () => {
    mockedUseDeviceDiagnostics.mockReturnValue({ natOpen: false } as Diagnostics)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.natAlert).toStrictEqual({
      message: 'alert.natClosedStatus',
      severity: StatusColor.ERROR,
      subText: 'poor',
    })
  })
  it('should not return nat closed alert', () => {
    mockedUseDeviceDiagnostics.mockReturnValue({ natOpen: true } as Diagnostics)
    const { result } = renderHook(() => useDiagnosticAlerts())

    expect(result.current.natAlert).toBe(undefined)
  })
})
