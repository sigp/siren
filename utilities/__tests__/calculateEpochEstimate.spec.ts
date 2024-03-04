import calculateEpochEstimate from '../calculateEpochEstimate'
import { secondsInHour } from '../../src/constants/constants'
import { formatUnits } from 'ethers/lib/utils'

jest.mock('ethers/lib/utils', () => ({
  formatUnits: jest.fn(),
}))

const mockedFormatUnits = formatUnits as jest.MockedFn<typeof formatUnits>

describe('calculateEpochEstimate util', () => {
  it('should return default value', () => {
    expect(calculateEpochEstimate(secondsInHour, 12)).toBe(0)
  })
  it('should return default value', () => {
    expect(
      calculateEpochEstimate(secondsInHour, 12, {
        2323: [32000000, 32000000],
      }),
    ).toBe(0)
  })
  it('should return correct values', () => {
    mockedFormatUnits.mockReturnValue('3000')
    expect(
      calculateEpochEstimate(secondsInHour, 12, {
        2323: [32000000, 32000000],
        2324: [32000000, 32000000],
      }),
    ).toBe(3000)
  })
})
