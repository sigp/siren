import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { validatorCacheBalanceResult, activeDevice } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { ValidatorCacheResults } from '../types/validator'
import { PollingOptions } from '../types'
import { selectSlicedActiveValidators } from '../recoil/selectors/selectSlicedActiveValidators'

const useValidatorCachePolling = (options?: PollingOptions) => {
  const { time = 60000, isReady = true } = options || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
  const activeValidators = useRecoilValue(selectSlicedActiveValidators)
  const setValidatorCache = useSetRecoilState(validatorCacheBalanceResult)

  const indices = activeValidators?.map((validator) => Number(validator.index))
  const cacheUrl = `${beaconUrl}/lighthouse/ui/validator_info`

  const { data } = usePollApi({
    key: 'validatorCache',
    time,
    url: cacheUrl,
    method: 'post',
    isReady: isReady && indices?.length > 0,
    payload: {
      indices,
    },
  })

  useEffect(() => {
    const result = data?.data.validators as ValidatorCacheResults
    if (result) {
      setValidatorCache(
        Object.fromEntries(Object.entries(result).map(([key, { info }]) => [Number(key), info])),
      )
    }
  }, [data])

  useEffect(() => {
    return () => {
      setValidatorCache(undefined)
    }
  }, [])
}

export default useValidatorCachePolling
