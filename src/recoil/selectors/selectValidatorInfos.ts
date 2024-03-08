import { formatUnits } from 'ethers/lib/utils'
import { selector } from 'recoil'
import formatDefaultValName from '../../../utilities/formatDefaultValName'
import { initialEthDeposit } from '../../constants/constants'
import { BeaconValidatorResult, ValidatorInfo } from '../../types/validator'
import { validatorAliases, validatorStateInfo } from '../atoms'

export const selectValidatorInfos = selector<ValidatorInfo[]>({
  key: 'ValidatorInfos',
  get: ({ get }) => {
    const validatorStates = get(validatorStateInfo)
    const aliases = get(validatorAliases)

    if (!validatorStates) return []

    const validatorInfo = [...validatorStates].sort(
      (a: BeaconValidatorResult, b: BeaconValidatorResult) => Number(a.index) - Number(b.index),
    )

    return validatorInfo.map(({ validator, index, status, balance }: BeaconValidatorResult) => {
      return {
        name: aliases?.[index] || formatDefaultValName(index),
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
