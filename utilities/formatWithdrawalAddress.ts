import { dataSlice, getAddress } from 'ethers'
import { Address } from '../src/types'

const formatWithdrawalAddress = (address: string) => {
  return getAddress(dataSlice(address, 12)) as Address
}

export default formatWithdrawalAddress
