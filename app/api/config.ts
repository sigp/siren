import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL

export const fetchBeaconNodeVersion = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/version`, token)
export const fetchValidatorAuthKey = async (token: string) =>
  await fetchFromApi(`${backendUrl}/validator/auth-key`, token)
export const fetchValidatorVersion = async (token: string) =>
  await fetchFromApi(`${backendUrl}/validator/version`, token)
export const fetchGenesisData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/genesis`, token)
