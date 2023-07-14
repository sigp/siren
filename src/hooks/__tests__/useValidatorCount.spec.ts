import { mockedRecoilValue, mockResponse } from '../../../test.helpers'
import { DEFAULT_VALIDATOR_COUNT } from '../../constants/constants'
import { renderHook } from '@testing-library/react-hooks'
import useValidatorCount from '../useValidatorCount'
import { Protocol } from '../../constants/enums'
import { fetchValidatorCount } from '../../api/lighthouse'
import { waitFor } from '@testing-library/react'

jest.mock('../../api/lighthouse', () => ({
  fetchValidatorCount: jest.fn(),
}))

jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
  atom: jest.fn(),
}))

const mockFetchResult = {
  active_exiting: 10,
  active_ongoing: 0,
  active_slashed: 0,
  exited_slashed: 0,
  exited_unslashed: 0,
  pending_initialized: 0,
  pending_queued: 0,
  withdrawal_done: 0,
  withdrawal_possible: 0,
}

const mockFetchValidatorCount = fetchValidatorCount as jest.MockedFn<typeof fetchValidatorCount>

describe('useValidatorCount', () => {
  it('should return default count info', () => {
    mockedRecoilValue.mockReturnValueOnce({})
    const { result } = renderHook(() => useValidatorCount())
    expect(result.current).toStrictEqual(DEFAULT_VALIDATOR_COUNT)
  })
  it('should call fetchCount when beacon node available', async () => {
    mockedRecoilValue.mockReturnValueOnce({ beaconUrl: 'mocked-url' })
    mockedRecoilValue.mockReturnValue({
      protocol: Protocol.HTTP,
      address: 'mockAddress',
      port: 10001,
    })

    mockFetchValidatorCount.mockReturnValue(
      Promise.resolve({
        ...mockResponse,
        data: {
          data: mockFetchResult,
        },
      }),
    )

    const { result } = renderHook(() => useValidatorCount())

    await waitFor(() => {
      expect(result.current).toStrictEqual(mockFetchResult)
    })
  })
})
