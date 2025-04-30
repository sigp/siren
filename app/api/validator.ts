import { BACKEND_URL } from '../../src/constants/envars'
import fetchFromApi from '../../utilities/fetchFromApi'

export const fetchValStates = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/states`, token)
export const fetchValCaches = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/caches`, token)
export const fetchValMetrics = async (token: string, index?: string | null) =>
  await fetchFromApi(`${BACKEND_URL}/validator/metrics${index ? `/${index}` : ''}`, token)
export const signVoluntaryExit = async (data: any, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/sign-exit`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const fetchValGraffiti = async (token: string, index: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/graffiti/${index}`, token)
export const updateValGraffiti = async (token: string, data: any) =>
  await fetchFromApi(`${BACKEND_URL}/validator/graffiti`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
export const importValidatorKeystore = async (data: any, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/import-keystore`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const fetchPartialWithdrawals = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/partial-withdrawals`, token)

export const fetchPendingDeposits = async (token: string) =>
  await fetchFromApi(`${BACKEND_URL}/validator/pending-deposits`, token)
