import { selector } from 'recoil'
import { validatorClientEndpoint } from '../atoms'
import formatEndpoint from '../../utilities/formatEndpoint'

export const selectValidatorUrl = selector({
  key: 'validatorUrl',
  get: ({ get }) => {
    const validator = get(validatorClientEndpoint)
    return `${formatEndpoint(validator)}/lighthouse`
  },
})
