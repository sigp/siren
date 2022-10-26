import axios from 'axios'
import { Endpoint } from '../forms/ConfigConnectionForm'

export const fetchSyncStatus = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/syncing`)

export const fetchBeaconVersion = async ({protocol, address, port}: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/version`)

export const fetchValidatorStatuses = async (
  baseBeaconUrl: string,
  validatorKeys: string,
  head = 'head',
) =>
  await axios.get(`${baseBeaconUrl}/v1/beacon/states/${head}/validators`, {
    params: {
      id: validatorKeys,
    },
  })
