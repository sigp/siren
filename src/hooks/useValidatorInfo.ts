import { fetchValidatorStatuses } from '../api/beacon'
import { Validator } from '../types/validator'
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { validatorStateInfo } from '../recoil/atoms'

const useValidatorInfo = () => {
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const { contents: validators } = useRecoilValueLoadable(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)

  const fetchValidatorInfo = async () => {
    if (!baseBeaconUrl || !validators) return

    const { data } = await fetchValidatorStatuses(
      baseBeaconUrl,
      validators.map((validator: Validator) => validator.pubKey).join(','),
    )

    setStateInfo(data.data)
  }

  return {
    fetchValidatorInfo,
  }
}

export default useValidatorInfo
