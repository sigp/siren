import { selector } from 'recoil'
import { ValidatorInfo } from '../../types/validator'
import { validatorIndex } from '../atoms'
import { selectValidatorInfos } from './selectValidatorInfos'

export const selectValidatorDetail = selector<ValidatorInfo | undefined>({
  key: 'selectValidatorDetail',
  get: ({ get }) => {
    const validators = get(selectValidatorInfos)
    const index = get(validatorIndex)

    return validators.find((validator) => Number(validator.index) === index)
  },
})
