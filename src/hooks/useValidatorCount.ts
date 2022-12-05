import { useEffect, useState } from 'react'
import { fetchValidatorCount } from '../api/lighthouse'
import { useRecoilValue } from 'recoil'
import { beaconNodeEndpoint } from '../recoil/atoms'
import { ValidatorCountResult } from '../types/validator'
import { DEFAULT_VALIDATOR_COUNT } from '../constants/constants'

const useValidatorCount = (): ValidatorCountResult => {
  const [data, setData] = useState(DEFAULT_VALIDATOR_COUNT)
  const beaconNode = useRecoilValue(beaconNodeEndpoint)

  const fetchCount = async () => {
    const { data } = await fetchValidatorCount(beaconNode)

    setData(data?.data)
  }

  useEffect(() => {
    if (beaconNode) {
      void fetchCount()
    }
  }, [beaconNode])

  return data
}

export default useValidatorCount
