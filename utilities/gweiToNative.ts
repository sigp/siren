import { formatUnits } from 'ethers'
import type { NetworkProfile } from './getNetworkProfile'

export const gweiToNative = (
  gwei: string | bigint | number,
  profile: NetworkProfile,
): number => {
  const eth = Number(formatUnits(gwei, 'gwei'))
  return profile.gweiDivisor === 1 ? eth : eth / profile.gweiDivisor
}
