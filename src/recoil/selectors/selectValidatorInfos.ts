import { selector } from 'recoil'
import { BeaconValidatorResult, ValidatorInfo } from '../../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { selectValidators } from './selectValidators'
import { initialEthDeposit } from '../../constants/constants'
import { validatorStateInfo } from '../atoms'

export const selectValidatorInfos = selector<ValidatorInfo[]>({
  key: 'ValidatorInfos',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get: ({ get }) => {
    const validators = get(selectValidators)
    const validatorStates = get(validatorStateInfo)

    if (!validatorStates) return []

    const validatorInfo = [...validatorStates].sort(
      (a: BeaconValidatorResult, b: BeaconValidatorResult) => Number(b.index) - Number(a.index),
    )

    return validatorInfo.map((info: BeaconValidatorResult) => {
      const validator = validators.find((validator) => validator.pubKey === info.validator.pubkey)

      return (
        validator && {
          ...validator,
          balance: Number(formatUnits(info.balance, 'gwei')),
          rewards: Number(formatUnits(info.balance, 'gwei')) - initialEthDeposit,
          index: Number(info.index),
          slashed: info.validator.slashed,
          status: info.status,
          processed: 0,
          missed: 0,
          attested: 0,
          aggregated: 0,
        }
      )
    })
  },
})
