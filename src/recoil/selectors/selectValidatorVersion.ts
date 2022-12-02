import { selector } from 'recoil'
import { validatorVersionData } from '../atoms'
import { NodeVersion } from '../../types'
import formatNodeVersion from '../../utilities/formatNodeVersion'

export const selectValidatorVersion = selector<NodeVersion | undefined>({
  key: 'selectValidatorVersion',
  get: ({ get }) => {
    const validator = get(validatorVersionData)
    return validator ? formatNodeVersion(validator) : undefined
  },
})
