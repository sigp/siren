import { useEffect, useState } from 'react'
import { fetchValidatorCount } from '../api/lighthouse'
import { useRecoilValue } from 'recoil'
import { ValidatorCountResult } from '../types/validator'
import { DEFAULT_VALIDATOR_COUNT } from '../constants/constants'
import { activeDevice } from '../recoil/atoms'

const useValidatorCount = (): ValidatorCountResult => {
  const [data, setData] = useState(DEFAULT_VALIDATOR_COUNT)
  const { beaconUrl } = useRecoilValue(activeDevice)

  const fetchCount = async () => {
    try {
      const { data } = await fetchValidatorCount(beaconUrl)

      setData(data?.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (beaconUrl) {
      void fetchCount()
    }
  }, [beaconUrl])

  return data
}

export default useValidatorCount
