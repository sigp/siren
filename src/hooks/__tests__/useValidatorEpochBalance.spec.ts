import useValidatorEpochBalance from '../useValidatorEpochBalance'
import { renderHook } from '@testing-library/react-hooks'
import { mockedRecoilValue } from '../../../test.helpers'
import { mockActiveValidators, mockValidatorCacheResults } from '../../mocks/validatorResults'
import { waitFor } from '@testing-library/react'
import { formatUnits } from 'ethers/lib/utils'
import clearAllMocks = jest.clearAllMocks
import { mockBeaconSpec } from '../../mocks/beaconSpec'

jest.mock('../../recoil/selectors/selectSlicedActiveValidators', () => ({
  selectSlicedActiveValidators: 'selectSlicedActiveValidators',
}))

jest.mock('../../recoil/atoms', () => ({
  validatorCacheBalanceResult: 'validatorCacheBalanceResult',
}))

jest.mock('../../recoil/selectors/selectBnSpec', () => ({
  selectBnSpec: 'selectBnSpec',
}))

jest.mock('ethers/lib/utils', () => ({
  formatUnits: jest.fn(),
}))

const mockedFormatUnits = formatUnits as jest.MockedFn<typeof formatUnits>

describe('useValidatorEpochBalance', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should return default values', () => {
    mockedRecoilValue.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'selectBnSpec') return mockBeaconSpec
    })
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
      if (data === 'selectBnSpec') return mockBeaconSpec
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'selectSlicedActiveValidators') return mockActiveValidators
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (data === 'validatorCacheBalanceResult') return mockValidatorCacheResults

      return 678909292
    })

    mockedFormatUnits.mockReturnValue('32.000')

    const { result } = renderHook(() => useValidatorEpochBalance())

    await waitFor(() => {
      expect(result.current.epochs).toStrictEqual([
        { name: 'mvk-1', data: [32, 32, 32], color: 'rgba(94, 65, 213, 1)', index: 0 },
        { name: 'mvk-2', data: [32, 32, 32], color: 'rgba(213, 65, 184, 1)', index: 1 },
        { name: 'mvk-3', data: [32, 32, 32], color: 'rgba(168, 65, 213, 1)', index: 2 },
        { name: 'mvk-4', data: [32, 32, 32], color: 'rgba(94, 65, 213, .6)', index: 3 },
        { name: 'mvk-5', data: [32, 32, 32], color: 'rgba(213, 65, 184, .6)', index: 4 },
      ])
    })
  })
})
