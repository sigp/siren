export default function formatEthAddress(address: string, padStart = 6, padEnd = 4) {
  return address ? `${address.slice(0, padStart)}...${address.slice(-padEnd)}` : ''
}
