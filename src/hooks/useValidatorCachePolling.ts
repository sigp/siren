import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconEpochInterval, validatorCacheBalanceResult } from '../recoil/atoms'
import { selectActiveValidators } from '../recoil/selectors/selectActiveValidators'
import usePollApi from './usePollApi'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { ValidatorCacheResults } from '../types/validator'

const useValidatorCachePolling = () => {
  const beaconUrl = useRecoilValue(selectBeaconUrl)
  const activeValidators = useRecoilValue(selectActiveValidators)
  const setValidatorCache = useSetRecoilState(validatorCacheBalanceResult)

  const indices = activeValidators?.map((validator) => Number(validator.index))
  const cacheUrl = beaconUrl && `${beaconUrl}/lighthouse/ui/validator_info`

  const { response } = usePollApi({
    time: 60000,
    url: cacheUrl,
    method: 'post',
    intervalState: beaconEpochInterval,
    isReady: !!cacheUrl && indices?.length > 0,
    data: {
      indices,
    },
  })

  useEffect(() => {
    const data = response?.data.data.validators as ValidatorCacheResults
    if (data) {
      setValidatorCache(
        Object.fromEntries(Object.entries(data).map(([key, { info }]) => [Number(key), info])),
      )
    }
  }, [response])

  useEffect(() => {
    return () => {
      setValidatorCache(undefined)
    }
  }, [])
}

export default useValidatorCachePolling
