import { Endpoint } from '../src/types'

const formatEndpoint = (endpoint?: Endpoint) => {
  if (!endpoint) return

  const { protocol, address, port } = endpoint

  const baseUrl = `${protocol}://`

  if (address.includes('/')) {
    const [firstAddress, ...remainingAddresses] = address.split('/')
    return `${baseUrl}${firstAddress}:${port}/${remainingAddresses.join('/')}`
  }

  return `${baseUrl}${address}:${port}`
}

export default formatEndpoint
