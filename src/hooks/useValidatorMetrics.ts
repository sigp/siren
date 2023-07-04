import usePrevious from './usePrevious'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchValidatorMetrics } from '../api/beacon'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { activeDevice, validatorCacheBalanceResult, validatorMetrics } from '../recoil/atoms'
import { selectValidatorInfos } from '../recoil/selectors/selectValidatorInfos'
import { ValidatorMetricEpoch } from '../types/beacon'

const useValidatorMetrics = () => {
  const validatorCacheData = useRecoilValue(validatorCacheBalanceResult)
  const { beaconUrl } = useRecoilValue(activeDevice)
  const validators = useRecoilValue(selectValidatorInfos)
  const setMetrics = useSetRecoilState(validatorMetrics)
  const [lastEpoch, setEpoch] = useState<number>()
  const previousEpoch = usePrevious(lastEpoch)
  const validatorList = validators?.map(({ index }) => index)
  const [results, setResults] = useState<ValidatorMetricEpoch>()

  const epochIds = useMemo(
    () =>
      validatorCacheData
        ? Object.values(validatorCacheData)[0]?.map(({ epoch }) => epoch) || []
        : [],
    [validatorCacheData],
  )

  const fetchMetrics = useCallback(async () => {
    try {
      const { data } = await fetchValidatorMetrics(beaconUrl, validatorList)

      if (data && lastEpoch) {
        const metrics = data.data.validators
        setResults((prev) => ({ ...prev, [lastEpoch]: metrics }))
      }
    } catch (e) {
      console.error(e)
    }
  }, [validatorList, beaconUrl, lastEpoch])

  useEffect(() => {
    if (!epochIds || !epochIds.length || !validatorList || !validatorList.length) return

    setEpoch(epochIds[epochIds.length - 1])
  }, [epochIds, validatorList])

  useEffect(() => {
    if (lastEpoch !== previousEpoch) {
      void fetchMetrics()
    }
  }, [lastEpoch, previousEpoch])

  useEffect(() => {
    if (results) {
      setMetrics(
        Object.keys(results)
          .slice(-3)
          .map((epochId) => results[epochId]),
      )
    }
  }, [results])
}

export default useValidatorMetrics
