import { renderHook } from '@testing-library/react-hooks'
import { mockValidatorCache } from '../../mocks/validatorResults'
import useFilteredValidatorCacheData from '../useFilteredValidatorCacheData'
import clearAllMocks = jest.clearAllMocks

describe('useFilteredValidatorCacheData hook', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('should return unfiltered data when no provided indices', () => {
    const { result } = renderHook(() => useFilteredValidatorCacheData(mockValidatorCache))
    expect(result.current).toBe(mockValidatorCache)
  })

  it('should return filtered data', () => {
    const { result } = renderHook(() =>
      useFilteredValidatorCacheData(mockValidatorCache, ['1234568']),
    )

    expect(result.current).toStrictEqual({
      1234568: [
        { epoch: 12345678, total_balance: 33 },
        { epoch: 12345679, total_balance: 33.00002 },
        { epoch: 12345679, total_balance: 33.000025 },
        { epoch: 12345679, total_balance: 33.00003 },
        { epoch: 12345679, total_balance: 33.00004 },
        { epoch: 12345679, total_balance: 33.000045 },
        { epoch: 12345679, total_balance: 33.000046 },
        { epoch: 12345679, total_balance: 33.000047 },
        { epoch: 12345679, total_balance: 33.00005 },
        { epoch: 12345679, total_balance: 33.000054 },
      ],
    })
  })
})
