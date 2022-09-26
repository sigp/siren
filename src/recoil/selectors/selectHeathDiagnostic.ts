import { selector } from 'recoil'
import { apiToken, validatorClientEndpoint } from '../atoms'
import axios from 'axios'
import { HealthDiagnosticResult } from '../../types/diagnostic'

export const selectHeathDiagnostic = selector<HealthDiagnosticResult>({
  key: 'HealthDiagnostic',
  get: async ({ get }) => {
    const { protocol, address, port } = get(validatorClientEndpoint)
    const token = get(apiToken)
    const { data } = await axios.get(`${protocol}://${address}:${port}/lighthouse/ui/health`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    return data.data
  },
})
