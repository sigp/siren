import { isAddress } from 'ethers'

// Validates if the input fee recipient is a valid Ethereum address

const isEthereumAddress = (address: string): boolean => {
  if (!address) return false
  return isAddress(address)
}

export default isEthereumAddress
