import axios from 'axios'

export const fetchVersion = async (baseUrl: string, apiToken: string) =>
  await axios.get(`${baseUrl}/version`, {
    headers: {
      authorization: `Bearer ${apiToken}`,
    },
  })

export const fetchValidators = async (baseUrl: string, token: string) =>
  await axios.get(`${baseUrl}/validators`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const fetchValidatorCount = async (baseUrl: string) =>
  await axios.get(`${baseUrl}/lighthouse/ui/validator_count`)

export const fetchValidatorGraffiti = async (baseValidatorUrl: string, token: string) =>
  await axios.get(`${baseValidatorUrl}/ui/graffiti`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const updateValidator = async (
  baseUrl: string,
  pubKey: string,
  token: string,
  data: Record<string, any>,
) =>
  await axios.patch(`${baseUrl}/validators/${pubKey}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const signVoluntaryExit = async (baseUrl: string, token: string, pubkey: string) =>
  await axios.post(`${baseUrl}/eth/v1/validator/${pubkey}/voluntary_exit`, null, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
