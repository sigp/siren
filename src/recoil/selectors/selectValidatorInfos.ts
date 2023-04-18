import { selector } from 'recoil'
import { BeaconValidatorResult, ValidatorInfo } from '../../types/validator'
import { formatUnits } from 'ethers/lib/utils'
import { selectValidators } from './selectValidators'
import { initialEthDeposit } from '../../constants/constants'
import { validatorStateInfo } from '../atoms'

export const selectValidatorInfos = selector<ValidatorInfo[]>({
  key: 'ValidatorInfos',
  get: ({ get }) => {
    const validators = get(selectValidators)
    const validatorStates = get(validatorStateInfo)

    if (!validatorStates) return []

    const validatorInfo = [...validatorStates].sort(
      (a: BeaconValidatorResult, b: BeaconValidatorResult) => Number(a.index) - Number(b.index),
    )

    return validatorInfo.map(({ validator, index, status, balance }: BeaconValidatorResult) => {
      const baseInfo = validators.find((v) => v.pubKey === validator.pubkey)

      return {
        name: baseInfo?.name || '',
        pubKey: validator.pubkey,
        balance: Number(formatUnits(balance, 'gwei')),
        rewards: Number(formatUnits(balance, 'gwei')) - initialEthDeposit,
        index: Number(index),
        slashed: validator.slashed,
        withdrawalAddress: validator.withdrawal_credentials,
        status: status,
        processed: 0,
        missed: 0,
        attested: 0,
        aggregated: 0,
      }
    })
  },
})
