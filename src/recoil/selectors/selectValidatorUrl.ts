import { selector } from 'recoil'
import { validatorClientEndpoint } from '../atoms'

export const selectValidatorUrl = selector({
  key: 'validatorUrl',
  get: ({ get }) => {
    const validator = get(validatorClientEndpoint)
    if (!validator) return undefined

    const { protocol, address, port } = validator

    return `${protocol}://${address}:${port}/lighthouse`
  },
})
