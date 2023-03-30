import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { secondsInSlot } from '../constants/constants'
import { useEffect } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { validatorInfoInterval, validatorStateInfo } from '../recoil/atoms'
import { Validator } from '../types/validator'
import usePollApi from './usePollApi'

const useValidatorInfoPolling = () => {
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const { contents: validators } = useRecoilValueLoadable(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)

  const validatorInfoUrl = baseBeaconUrl && `${baseBeaconUrl}/eth/v1/beacon/states/head/validators`
  const validatorIdString =
    validators?.length && validators.map((validator: Validator) => validator.pubKey).join(',')

  const { response } = usePollApi({
    time: secondsInSlot * 1000,
    isReady: validatorInfoUrl && validatorIdString,
    intervalState: validatorInfoInterval,
    url: validatorInfoUrl,
    params: {
      id: validatorIdString,
    },
  })

  useEffect(() => {
    const data = response?.data.data
    if (data) {
      setStateInfo(data)
    }
  }, [response])
}

export default useValidatorInfoPolling
