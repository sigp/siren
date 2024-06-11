import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL

export const fetchValStates = async (token: string,) =>
  await fetchFromApi(`${backendUrl}/validator/states`, token)
export const fetchValCaches = async (token: string,) =>
  await fetchFromApi(`${backendUrl}/validator/caches`, token)
export const fetchValMetrics = async (token: string, index?: string | null) =>
  await fetchFromApi(`${backendUrl}/validator/metrics${index ? `/${index}` : ''}`, token)
export const signVoluntaryExit = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/validator/sign-exit`, token,{
    method: 'POST',
    body: JSON.stringify(data)
  })
export const fetchValGraffiti =  async (token: string, index: string) =>
  await fetchFromApi(`${backendUrl}/validator/graffiti/${index}`, token)
export const updateValGraffiti = async (token: string, data: any) =>
  await fetchFromApi(`${backendUrl}/validator/graffiti`, token,{
    method: 'PUT',
    body: JSON.stringify(data)
  })