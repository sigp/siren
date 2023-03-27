import { useRecoilValue } from 'recoil'
import { validatorCacheBalanceResult } from '../recoil/atoms'
import { useMemo } from 'react'
import { ValidatorCacheResults } from '../types/validator'

const useFilteredValidatorCacheData = (indices?: string[]): ValidatorCacheResults | undefined => {
  const validatorCacheData = useRecoilValue(validatorCacheBalanceResult)

  return useMemo(() => {
    if (!validatorCacheData) return undefined

    if (!indices) return validatorCacheData

    return Object.keys(validatorCacheData)
      .filter((key) => indices.includes(key))
      .reduce((obj, key: string) => {
        return Object.assign(obj, {
          [key]: validatorCacheData[Number(key)],
        })
      }, {})
  }, [validatorCacheData, indices])
}

export default useFilteredValidatorCacheData
