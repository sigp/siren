import usePollingInterval from './usePollingInterval'
import { useCallback, useEffect } from 'react'
import { fetchValidatorBalanceCache } from '../api/beacon'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  beaconEpochInterval,
  beaconNodeEndpoint,
  validatorCacheBalanceResult,
} from '../recoil/atoms'
import { selectActiveValidators } from '../recoil/selectors/selectActiveValidators'

const useValidatorCachePolling = () => {
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint)
  const activeValidators = useRecoilValue(selectActiveValidators)
  const [cachedData, setCacheResult] = useRecoilState(validatorCacheBalanceResult)
  const [epochInterval, setInterval] = useRecoilState(beaconEpochInterval)
  const setValidatorCache = useSetRecoilState(validatorCacheBalanceResult)
  const onClearInterval = () => setInterval(undefined)

  useEffect(() => {
    if (activeValidators.length && beaconEndpoint && !cachedData) {
      void fetchValidatorBalances()
    }
  }, [activeValidators, beaconEndpoint, cachedData])

  const fetchValidatorBalances = useCallback(async () => {
    const activeIndices = activeValidators.map((validator) => Number(validator.index))

    if (!activeIndices.length) return

    const { data } = await fetchValidatorBalanceCache(beaconEndpoint, activeIndices)

    if (data) {
      setCacheResult(data.data.validators)
    }
  }, [activeValidators])

  const { intervalId } = usePollingInterval(fetchValidatorBalances, 60000, {
    isSkip: Boolean(activeValidators && activeValidators.length) && Boolean(epochInterval),
    onClearInterval,
  })

  useEffect(() => {
    return () => {
      setValidatorCache(undefined)
    }
  }, [])

  useEffect(() => {
    if (intervalId) {
      setInterval(intervalId)
    }
  }, [intervalId])
}

export default useValidatorCachePolling
