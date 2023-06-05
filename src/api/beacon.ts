import axios from 'axios'

export const fetchSyncStatus = async (baseUrl: string) =>
  await axios.get(`${baseUrl}/eth/v1/node/syncing`)

export const fetchBeaconVersion = async (baseUrl: string) =>
  await axios.get(`${baseUrl}/eth/v1/node/version`)

export const fetchGenesisBlock = async (baseUrl: string) =>
  await axios.get(`${baseUrl}/eth/v1/beacon/genesis`)

export const fetchValidatorInclusion = async (
  baseBeaconUrl: string,
  epoch: number,
  validatorId?: string,
) =>
  await axios.get(
    `${baseBeaconUrl}/lighthouse/validator_inclusion/${epoch}/${validatorId || 'global'}`,
  )

export const fetchBnSpec = async (baseUrl: string) =>
  await axios.get(`${baseUrl}/eth/v1/config/spec`)

export const fetchValidatorMetrics = async (baseUrl: string, indices: number[]) =>
  await axios.post(`${baseUrl}/lighthouse/ui/validator_metrics`, {
    indices,
  })

export const broadcastBlsChange = async (baseUrl: string, data: any) =>
  await axios.post(`${baseUrl}/eth/v1/beacon/pool/bls_to_execution_changes`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const submitSignedExit = async (baseUrl: string, data: any) =>
  await axios.post(`${baseUrl}/eth/v1/beacon/pool/voluntary_exits`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
