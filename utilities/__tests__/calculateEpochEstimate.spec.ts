import calculateEpochEstimate from '../calculateEpochEstimate'
import { secondsInHour } from '../../src/constants/constants'
import { getNetworkProfile } from '../getNetworkProfile'

describe('calculateEpochEstimate util', () => {
  it('returns 0 when epochs is undefined', () => {
    expect(calculateEpochEstimate(secondsInHour, 12)).toBe(0)
  })

  it('returns 0 when only one epoch is present', () => {
    expect(
      calculateEpochEstimate(secondsInHour, 12, {
        2323: [32000000, 32000000],
      }),
    ).toBe(0)
  })

  it('converts gwei diff to native ETH unit by default', () => {
    // diff = 0, so result is 0; smoke-test the no-throw path.
    expect(
      calculateEpochEstimate(secondsInHour, 12, {
        2323: [32000000, 32000000],
        2324: [32000000, 32000000],
      }),
    ).toBe(0)
  })

  it('applies the mainnet profile divisor (1) — unchanged math', () => {
    const mainnet = getNetworkProfile('mainnet')
    // 100 gwei spread over 2 epochs of 32 slots * 12s = 768s, scaled to 1h (3600s)
    // diff = 100, timeMultiplier = 3600 / (12 * 32 * 2) = 4.6875
    // scaledGwei = floor(100 * 4.6875) = 468, /1e9 ETH ≈ 4.68e-7
    const result = calculateEpochEstimate(
      secondsInHour,
      12,
      { 1: [50], 2: [150] },
      mainnet,
    )
    expect(result).toBeCloseTo(468e-9, 12)
  })

  it('applies the gnosis profile divisor (32)', () => {
    const gnosis = getNetworkProfile('gnosis')
    const mainnet = getNetworkProfile('mainnet')
    const mainnetResult = calculateEpochEstimate(
      secondsInHour,
      12,
      { 1: [50], 2: [150] },
      mainnet,
    )
    const gnosisResult = calculateEpochEstimate(
      secondsInHour,
      12,
      { 1: [50], 2: [150] },
      gnosis,
    )
    expect(gnosisResult).toBeCloseTo(mainnetResult / 32, 12)
  })

  it('doubles the estimate when slotsPerEpoch is halved (Gnosis: 16 vs ETH: 32)', () => {
    const mainnet = getNetworkProfile('mainnet')
    // Use large gwei magnitudes so Math.floor() rounding noise is negligible
    // (real validator balances are ~3e10+ gwei).
    const epochs = { 1: [50_000_000_000], 2: [150_000_000_000] }
    const withEth = calculateEpochEstimate(secondsInHour, 12, epochs, mainnet, 32)
    const withGnosis = calculateEpochEstimate(secondsInHour, 12, epochs, mainnet, 16)
    expect(withGnosis / withEth).toBeCloseTo(2, 6)
  })

  it('defaults slotsPerEpoch to 32 when the param is omitted', () => {
    const mainnet = getNetworkProfile('mainnet')
    const epochs = { 1: [50_000_000_000], 2: [150_000_000_000] }
    const defaulted = calculateEpochEstimate(secondsInHour, 12, epochs, mainnet)
    const explicit = calculateEpochEstimate(secondsInHour, 12, epochs, mainnet, 32)
    expect(defaulted).toBe(explicit)
  })
})
