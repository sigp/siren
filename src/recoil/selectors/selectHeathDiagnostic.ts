import { selector } from 'recoil'
import axios from 'axios'
import { HealthDiagnosticResult } from '../../types/diagnostic'
import { beaconNodeEndpoint } from '../atoms';

export const selectHeathDiagnostic = selector<HealthDiagnosticResult>({
  key: 'HealthDiagnostic',
  get: async ({ get }) => {
    const {protocol, port, address} = get(beaconNodeEndpoint)
    const { data } = await axios.get(`${protocol}://${address}:${port}/lighthouse/ui/health`)

    return data.data
  },
})
