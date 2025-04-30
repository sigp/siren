import { BACKEND_URL } from '../../src/constants/envars'
import fetchFromApi from '../../utilities/fetchFromApi'

export const fetchBeaconNodeVersion = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/version`, token)
export const fetchValidatorAuthKey = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/auth-key`, token)
export const fetchValidatorVersion = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/version`, token)
export const fetchGenesisData = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/beacon/genesis`, token)
