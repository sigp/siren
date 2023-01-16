import useValidatorEpochBalance from '../useValidatorEpochBalance'
import { renderHook } from '@testing-library/react-hooks'
import { mockedRecoilValue, mockResponse } from '../../../test.helpers'
import { Protocol } from '../../constants/enums'
import {
  mockValidatorCacheResults,
  mockValidatorInfo,
  mockValidators,
} from '../../mocks/validatorResults'
import { fetchValidatorBalanceCache } from '../../api/beacon'
import { waitFor } from '@testing-library/react'
import { formatUnits } from 'ethers/lib/utils'
import clearAllMocks = jest.clearAllMocks

jest.mock('../../recoil/selectors/selectValidators', () => ({
  selectValidators: 'selectValidators',
}))

jest.mock('../../recoil/atoms', () => ({
  beaconNodeEndpoint: 'beaconNodeEndpoint',
  validatorStateInfo: 'validatorStateInfo',
}))

jest.mock('ethers/lib/utils', () => ({
  formatUnits: jest.fn(),
}))

jest.mock('../../api/beacon', () => ({
  fetchValidatorBalanceCache: jest.fn(),
}))

const mockedFormatUnits = formatUnits as jest.MockedFn<typeof formatUnits>

const mockedFetchValidatorBalanceCache = fetchValidatorBalanceCache as jest.MockedFn<
  typeof fetchValidatorBalanceCache
>

describe('useValidatorEpochBalance', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should return default values', () => {
    const { result } = renderHook(() => useValidatorEpochBalance())

    expect(result.current).toStrictEqual({
      epochs: [],
      timestamps: [],
      isSufficientData: false,
    })
  })
  it('should call fetch function', async () => {
    mockedRecoilValue.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'selectValidators') return mockValidators
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'beaconNodeEndpoint')
        return {
          protocol: Protocol.HTTP,
          address: 'mock-address',
          port: 8001,
        }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'validatorStateInfo') return mockValidatorInfo

      return 678909292
    })

    mockedFetchValidatorBalanceCache.mockReturnValue(
      Promise.resolve({
        ...mockResponse,
        data: {
          data: mockValidatorCacheResults,
        },
      }),
    )

    mockedFormatUnits.mockReturnValue('32.000')

    const { result } = renderHook(() => useValidatorEpochBalance())

    await waitFor(() => {
      expect(result.current.epochs).toStrictEqual([
        { name: 'mvk-1', data: [32, 32, 32] },
        { name: 'mvk-2', data: [32, 32, 32] },
        { name: 'mvk-3', data: [32, 32, 32] },
        { name: 'mvk-4', data: [32, 32, 32] },
        { name: 'mvk-5', data: [32, 32, 32] },
      ])
    })
  })
  it('should not call fetch function if no active indices', () => {
    mockedRecoilValue.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'selectValidators') return mockValidators
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'beaconNodeEndpoint')
        return {
          protocol: Protocol.HTTP,
          address: 'mock-address',
          port: 8001,
        }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'validatorStateInfo') return []

      return 678909292
    })
    renderHook(() => useValidatorEpochBalance())

    expect(mockedFetchValidatorBalanceCache).toBeCalledTimes(0)
  })
})
