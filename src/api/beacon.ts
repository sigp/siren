import axios from 'axios'
import { Endpoint } from '../types'

export const fetchSyncStatus = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/syncing`)

export const fetchBeaconVersion = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/version`)

export const fetchValidatorStatuses = async (
  baseBeaconUrl: string,
  validatorKeys: string,
  head = 'head',
) =>
  await axios.get(`${baseBeaconUrl}/eth/v1/beacon/states/${head}/validators`, {
    params: {
      id: validatorKeys,
    },
  })

export const fetchGenesisBlock = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/beacon/genesis`)

export const fetchValidatorBalanceCache = async (
  { protocol, address, port }: Endpoint,
  indices: number[],
) => await axios.post(`${protocol}://${address}:${port}/lighthouse/ui/validator_info`, { indices })

export const fetchValidatorInclusion = async (
  baseBeaconUrl: string,
  epoch: number,
  validatorId?: string,
) =>
  await axios.get(
    `${baseBeaconUrl}/lighthouse/validator_inclusion/${epoch}/${validatorId || 'global'}`,
  )
