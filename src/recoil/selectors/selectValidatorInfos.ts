import { selector } from 'recoil'
import { BeaconValidatorResult, ValidatorInfo } from '../../types/validator'
import { selectBeaconUrl } from './selectBeaconUrl'
import { formatUnits } from 'ethers/lib/utils'
import { fetchValidatorStatuses } from '../../api/beacon'
import { selectValidators } from './selectValidators'
import { initialEthDeposit } from '../../constants/constants'

export const selectValidatorInfos = selector<ValidatorInfo[]>({
  key: 'ValidatorInfos',
  get: async ({ get }) => {
    const baseBeaconUrl = get(selectBeaconUrl)
    const validators = get(selectValidators)

    if (!baseBeaconUrl) return

    const beaconValidators = await fetchValidatorStatuses(
      baseBeaconUrl,
      validators.map((validator) => validator.pubKey).join(','),
    )

    const validatorInfo = beaconValidators.data.data.sort(
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
