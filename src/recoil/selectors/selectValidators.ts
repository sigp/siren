import { selector } from 'recoil'
import { fetchValidators } from '../../api/lighthouse'
import { LighthouseValidatorResult, Validator } from '../../types/validator'
import { activeDevice } from '../atoms'

export const selectValidators = selector<Validator[]>({
  key: 'validatorsDatas',
  get: async ({ get }) => {
    const { apiToken, validatorUrl } = get(activeDevice)
    const { data } = await fetchValidators(validatorUrl, apiToken)

    return data.data.map((validator: LighthouseValidatorResult) => ({
      pubKey: validator.voting_pubkey,
    }))
  },
})
