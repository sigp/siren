import { selector } from 'recoil'
import formatNodeVersion from '../../../utilities/formatNodeVersion'
import { NodeVersion } from '../../types'
import { validatorVersionData } from '../atoms'

export const selectValidatorVersion = selector<NodeVersion | undefined>({
  key: 'selectValidatorVersion',
  get: ({ get }) => {
    const validator = get(validatorVersionData)
    return validator ? formatNodeVersion(validator) : undefined
  },
})
