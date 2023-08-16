import { Protocol } from '../constants/enums'
import { Endpoint } from '../types'

const parseEndpointString = (endpointString?: string): Endpoint | undefined => {
  const regex = /^(https?):\/\/([\w.-]+):(\d+)(\/\w*)?$/
  const match = endpointString?.match(regex)

  if (match) {
    const [, protocol, address, portStr] = match
    const port = parseInt(portStr, 10)

    return {
      protocol: protocol as Protocol,
      address,
      port,
    }
  }

  return undefined
}

export default parseEndpointString
