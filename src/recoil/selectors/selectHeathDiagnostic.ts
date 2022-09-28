import { selector } from 'recoil'
import axios from 'axios'
import { HealthDiagnosticResult } from '../../types/diagnostic'
import { selectValidatorUrl } from './selectValidatorUrl'
import { apiToken } from '../atoms';

export const selectHeathDiagnostic = selector<HealthDiagnosticResult>({
  key: 'HealthDiagnostic',
  get: async ({ get }) => {
    const baseValidatorUrl = get(selectValidatorUrl)
    const token = get(apiToken)
    const { data } = await axios.get(`${baseValidatorUrl}/ui/health`, {
      headers: {Authorization: `Bearer ${token}`}}
    )

    return data.data
  },
})
