import axios from 'axios'
import { Endpoint } from '../types'

export const fetchSyncStatus = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/syncing`)

export const fetchBeaconVersion = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/node/version`)

export const fetchGenesisBlock = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/beacon/genesis`)

export const fetchValidatorInclusion = async (
  baseBeaconUrl: string,
  epoch: number,
  validatorId?: string,
) =>
  await axios.get(
    `${baseBeaconUrl}/lighthouse/validator_inclusion/${epoch}/${validatorId || 'global'}`,
  )

export const fetchBnSpec = async ({ protocol, address, port }: Endpoint) =>
  await axios.get(`${protocol}://${address}:${port}/eth/v1/config/spec`)

export const fetchValidatorMetrics = async (
  { protocol, address, port }: Endpoint,
  indices: number[],
) =>
  await axios.post(`${protocol}://${address}:${port}/lighthouse/ui/validator_metrics`, {
    indices,
  })

export const broadcastBlsChange = async ({ protocol, address, port }: Endpoint, data: any) =>
  await axios.post(
    `${protocol}://${address}:${port}/eth/v1/beacon/pool/bls_to_execution_changes`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
