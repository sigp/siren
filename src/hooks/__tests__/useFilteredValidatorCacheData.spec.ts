import { renderHook } from '@testing-library/react-hooks'
import useFilteredValidatorCacheData from '../useFilteredValidatorCacheData'
import { mockedRecoilValue } from '../../../test.helpers'
import { mockValidatorCache } from '../../mocks/validatorResults'
import clearAllMocks = jest.clearAllMocks

describe('useFilteredValidatorCacheData hook', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('should return undefined if no validator cache data', () => {
    mockedRecoilValue.mockReturnValue(undefined)
    const { result } = renderHook(() => useFilteredValidatorCacheData())

    expect(result.current).toBe(undefined)
  })

  it('should return unfiltered data when no provided indices', () => {
    mockedRecoilValue.mockReturnValue(mockValidatorCache)
    const { result } = renderHook(() => useFilteredValidatorCacheData())

    expect(result.current).toStrictEqual(mockValidatorCache)
  })

  it('should return filtered data', () => {
    mockedRecoilValue.mockReturnValue(mockValidatorCache)
    const { result } = renderHook(() => useFilteredValidatorCacheData(['1234567']))

    expect(result.current).toStrictEqual({ '1234567': mockValidatorCache['1234567'] })
  })
})
