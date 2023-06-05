import { useEffect, useState } from 'react'
import { fetchValidatorCount } from '../api/lighthouse'
import { useRecoilValue } from 'recoil'
import { ValidatorCountResult } from '../types/validator'
import { DEFAULT_VALIDATOR_COUNT } from '../constants/constants'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'

const useValidatorCount = (): ValidatorCountResult => {
  const [data, setData] = useState(DEFAULT_VALIDATOR_COUNT)
  const beaconNode = useRecoilValue(selectBeaconUrl)

  const fetchCount = async () => {
    try {
      const { data } = await fetchValidatorCount(beaconNode)

      setData(data?.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    void fetchCount()
  }, [beaconNode])

  return data
}

export default useValidatorCount
