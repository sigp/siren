import { Endpoint } from '../types'

const formatHealthEndpoint = (endpoint?: Endpoint) => {
  const { protocol, address, port } = endpoint || {}
  return endpoint ? `${protocol}://${address}:${port}/lighthouse/ui/health` : undefined
}

export default formatHealthEndpoint
