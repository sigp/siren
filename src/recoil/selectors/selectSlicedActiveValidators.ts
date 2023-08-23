import { selector } from 'recoil'
import { activeValidatorDetail } from '../../types/validator'
import { selectActiveValidators } from './selectActiveValidators'

export const selectSlicedActiveValidators = selector<activeValidatorDetail[]>({
  key: 'selectSlicedActiveValidators',
  get: ({ get }) => {
    const validators = get(selectActiveValidators)

    return validators?.length ? validators.slice(0, 10) : []
  },
})
