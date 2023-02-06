import { selector } from 'recoil'
import { validatorStateInfo } from '../atoms'
import { selectValidators } from './selectValidators'
import { activeValidatorDetail } from '../../types/validator'

export const selectActiveValidators = selector<activeValidatorDetail[]>({
  key: 'selectActiveValidators',
  get: ({ get }) => {
    const validators = get(selectValidators)
    const validatorInfo = get(validatorStateInfo)

    return validatorInfo
      ? validatorInfo
          .map(({ status, validator, index }) => {
            const { name, pubKey } =
              validators.find(({ pubKey }) => pubKey === validator.pubkey) || {}
            return { status, pubKey, index, name }
          })
          .filter(({ status }) => status.includes('active') && !status.includes('slashed'))
          .slice(0, 10)
      : []
  },
})
