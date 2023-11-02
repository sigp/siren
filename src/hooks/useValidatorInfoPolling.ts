import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { useEffect } from 'react'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { activeDevice, validatorStateInfo } from '../recoil/atoms'
import { Validator } from '../types/validator'
import usePollApi from './usePollApi'
import { PollingOptions } from '../types'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'

const useValidatorInfoPolling = (options?: PollingOptions) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const { time = SECONDS_PER_SLOT * 1000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const { contents: validators } = useRecoilValueLoadable(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)

  const validatorInfoUrl = `${beaconUrl}/eth/v1/beacon/states/head/validators`
  const validatorIdString = validators?.length
    ? validators.map((validator: Validator) => validator.pubKey).join(',')
    : undefined

  const { data } = usePollApi({
    key: 'validatorInfo',
    time,
    isReady: !!validatorIdString && isReady,
    url: validatorInfoUrl,
    params: {
      id: validatorIdString,
    },
  })

  useEffect(() => {
    const result = data?.data
    if (result) {
      setStateInfo(result)
    }
  }, [data])
}

export default useValidatorInfoPolling
