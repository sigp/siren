import { selector } from 'recoil'
import { validatorSearch } from '../atoms'
import { ValidatorInfo } from '../../types/validator'
import { selectValidatorInfos } from './selectValidatorInfos'

export const selectFilteredValidators = selector<ValidatorInfo[]>({
  key: 'selectFilteredValidators',
  get: ({ get }) => {
    const validators = get(selectValidatorInfos)
    const searchValue = get(validatorSearch)

    return validators.filter((validator) => {
      const query = searchValue.toLowerCase()

      return (
        validator.name.toLowerCase().includes(query) ||
        (query.length > 3 && validator.pubKey.toLowerCase().includes(query)) ||
        validator.index.toString().includes(query)
      )
    })
  },
})
