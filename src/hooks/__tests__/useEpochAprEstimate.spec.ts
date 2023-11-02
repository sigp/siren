import useEpochAprEstimate from '../useEpochAprEstimate'
import { renderHook } from '@testing-library/react-hooks'
import { mockedRecoilValue } from '../../../test.helpers'
import { formatUnits } from 'ethers/lib/utils'
import {
  mockValidatorCache,
  mockedWithdrawalCash,
  mockedWithdrawalCashLoss,
  mockShortValidatorCache,
  mockedRecentWithdrawalCash,
} from '../../mocks/validatorResults'
import { mockBeaconSpec } from '../../mocks/beaconSpec'
import useFilteredValidatorCacheData from '../useFilteredValidatorCacheData'

jest.mock('../useFilteredValidatorCacheData', () => jest.fn())

const mockedUseFilteredValidatorCacheData = useFilteredValidatorCacheData as jest.MockedFn<
  typeof useFilteredValidatorCacheData
>

jest.mock('ethers/lib/utils', () => ({
  formatUnits: jest.fn(),
}))

const mockedFormatUnits = formatUnits as jest.MockedFn<typeof formatUnits>

describe('useEpochAprEstimate hook', () => {
  beforeEach(() => {
    mockedFormatUnits.mockImplementation((value) => value.toString())
  })
  it('should return default values', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(undefined)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: undefined,
      textColor: 'text-dark500',
    })
  })
  it('should return default values when not enough epoch data', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockShortValidatorCache)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: undefined,
      textColor: 'text-dark500',
    })
  })
  it('should return correct values', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockValidatorCache)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: 1.3438636363304557,
      textColor: 'text-success',
    })
  })

  it('should return correct values when provided an array of indexes', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockValidatorCache)
    const { result } = renderHook(() => useEpochAprEstimate(['1234567']))
    expect(result.current).toStrictEqual({
      estimatedApr: 1.3438636363304557,
      textColor: 'text-success',
    })
  })

  it('should return correct when there is a withdrawal value', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockedWithdrawalCash)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: 3.8495973450145105,
      textColor: 'text-success',
    })
  })

  it('should return correct when there is a withdrawal values at a loss', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockedWithdrawalCashLoss)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: -0.1710932155095768,
      textColor: 'text-error',
    })
  })

  it('should return correct values when last epoch was a withdrawal', () => {
    mockedRecoilValue.mockReturnValue(mockBeaconSpec)
    mockedUseFilteredValidatorCacheData.mockReturnValue(mockedRecentWithdrawalCash)
    const { result } = renderHook(() => useEpochAprEstimate())
    expect(result.current).toStrictEqual({
      estimatedApr: 0,
      textColor: 'text-dark500',
    })
  })
})
