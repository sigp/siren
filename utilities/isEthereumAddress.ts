/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns true if valid Ethereum address, false otherwise
 */
const isEthereumAddress = (address: string): boolean => {
  if (!address) return false

  // Check if it starts with 0x and is 42 characters long
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethAddressRegex.test(address)
}

export default isEthereumAddress
