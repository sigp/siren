import { BACKEND_URL } from '../../src/constants/envars'
import fetchFromApi from '../../utilities/fetchFromApi'
import fetchFromApiWithRetry from '../../utilities/fetchFromApiWithRetry'

export const fetchBeaconNodeVersion = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/version`, token)
export const fetchBeaconNodeHeartbeat = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/heartbeat`, token)
export const fetchValidatorAuthKey = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/auth-key`, token)
export const fetchValidatorVersion = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/version`, token)
export const fetchGenesisData = async (token: string) =>
  await fetchFromApiWithRetry(`${BACKEND_URL}/beacon/genesis`, token, undefined, {
    maxRetries: 3,
    initialDelay: 1000,
    timeout: 10000,
  })
export const fetchValidatorStatusExclusionList = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/exclude-status`, token)
