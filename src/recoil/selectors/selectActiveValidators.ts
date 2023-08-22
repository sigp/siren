import { selector } from 'recoil'
import { activeValidatorDetail } from '../../types/validator'
import { selectValidatorInfos } from './selectValidatorInfos'

export const selectActiveValidators = selector<activeValidatorDetail[]>({
  key: 'selectActiveValidators',
  get: ({ get }) => {
    const validatorInfo = get(selectValidatorInfos)

    return validatorInfo
      ? validatorInfo
          .filter(
            ({ status }) =>
              status.includes('active') &&
              !status.includes('slashed') &&
              !status.includes('exiting') &&
              !status.includes('exited'),
          )
          .map(({ status, pubKey, index, name }) => ({
            status,
            pubKey,
            index: String(index),
            name,
          }))
      : []
  },
})
