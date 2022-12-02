import axios from 'axios'
import { Endpoint } from '../types'

export const fetchVersion = async ({ protocol, address, port }: Endpoint, apiToken: string) =>
  await axios.get(`${protocol}://${address}:${port}/lighthouse/version`, {
    headers: {
      authorization: `Bearer ${apiToken}`,
    },
  })

export const fetchValidators = async (baseValidatorUrl: string, token: string) =>
  await axios.get(`${baseValidatorUrl}/validators`, {
    headers: { Authorization: `Bearer ${token}` },
  })
