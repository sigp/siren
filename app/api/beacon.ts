import { BACKEND_URL } from '../../src/constants/envars'
import fetchFromApi from '../../utilities/fetchFromApi'
import fetchFromApiWithRetry from '../../utilities/fetchFromApiWithRetry'

export const fetchNodeHealth = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/node/health`, token)
export const fetchSyncData = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/sync`, token)
export const fetchInclusionRate = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/inclusion`, token)
export const fetchPeerData = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/peer`, token)
export const fetchBeaconSpec = async (token: string) =>
  await fetchFromApiWithRetry(`${BACKEND_URL}/beacon/spec`, token, undefined, {
    maxRetries: 3,
    initialDelay: 1000,
    timeout: 10000,
  })
export const fetchValidatorCountData = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/validator-count`, token)
export const fetchProposerDuties = async (token: string) =>
  fetchFromApi(`${BACKEND_URL}/beacon/proposer-duties`, token)
export const broadcastBlsChange = async (data: any, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/bls-execution`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const submitSignedExit = async (data: any, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/execute-exit`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const fetchValidatorStatus = async (token: string, pubKey: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/validator-status/${pubKey}`, token)

export const fetchForkVersion = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/fork-version`, token)
