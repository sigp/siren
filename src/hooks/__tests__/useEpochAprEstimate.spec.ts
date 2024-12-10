import { renderHook } from '@testing-library/react-hooks'
import { useRecoilValue } from 'recoil'
import useEpochAprEstimate from '../useEpochAprEstimate'

jest.mock('recoil')

const mockedRecoilValue = useRecoilValue as jest.Mock

describe('useEpochAprEstimate', () => {
  beforeEach(() => {
    const mockBeaconSpec = { SECONDS_PER_SLOT: 12, SLOTS_PER_EPOCH: 32 }
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    jest.resetAllMocks()
  })

  it('should return correct values', async () => {
    const { result, waitFor } = renderHook(() =>
      useEpochAprEstimate({
        1234567: [
          { epoch: 12345678, total_balance: '32000000000' },
          { epoch: 12345679, total_balance: '32001811011' },
        ],
        1234568: [
          { epoch: 12345678, total_balance: '32000000000' },
          { epoch: 12345679, total_balance: '32001811011' },
        ],
      } as any),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        estimatedApr: 232.3923271657427,
        textColor: 'text-success',
      })
    })
  })

  it('should return correct filtered values', async () => {
    const { result, waitFor } = renderHook(() =>
      useEpochAprEstimate(
        {
          1234567: [
            { epoch: 12345678, total_balance: '32000000000' },
            { epoch: 12345679, total_balance: '32001111011' },
          ],
          1234568: [
            { epoch: 12345678, total_balance: '32000000000' },
            { epoch: 12345679, total_balance: '32001811011' },
          ],
        } as any,
        ['1234567'],
      ),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        estimatedApr: 142.56701466549612,
        textColor: 'text-success',
      })
    })
  })

  it('should return default values if not epoch data', async () => {
    const { result, waitFor } = renderHook(() =>
      useEpochAprEstimate({
        1234567: [],
        1234568: [],
      } as any),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        estimatedApr: undefined,
        textColor: 'text-dark500',
      })
    })
  })
})
