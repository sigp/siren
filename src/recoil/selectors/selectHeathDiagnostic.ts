import { selector } from 'recoil'
import axios from 'axios'
import { HealthDiagnosticResult } from '../../types/diagnostic'
import { selectValidatorUrl } from './selectValidatorUrl'

export const selectHeathDiagnostic = selector<HealthDiagnosticResult>({
  key: 'HealthDiagnostic',
  get: async ({ get }) => {
    const baseValidatorUrl = get(selectValidatorUrl)
    const { data } = await axios.get(`${baseValidatorUrl}/ui/health`)

    return data.data
  },
})
