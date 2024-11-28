import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL

export const fetchNodeHealth = async (token: string) =>
  await fetchFromApi(`${backendUrl}/node/health`, token)
export const fetchSyncData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/sync`, token)
export const fetchInclusionRate = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/inclusion`, token)
export const fetchPeerData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/peer`, token)
export const fetchBeaconSpec = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/spec`, token)
export const fetchValidatorCountData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/validator-count`, token)
export const fetchProposerDuties = async (token: string) =>
  fetchFromApi(`${backendUrl}/beacon/proposer-duties`, token)
export const broadcastBlsChange = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/bls-execution`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const submitSignedExit = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/execute-exit`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const fetchValidatorStatus = async (token: string, pubKey: string) =>
  await fetchFromApi(`${backendUrl}/beacon/validator-status/${pubKey}`, token)
