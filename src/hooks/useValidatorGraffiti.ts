import { useEffect, useMemo, useState } from 'react'
import { ValidatorGraffitiResults, ValidatorInfo } from '../types/validator'
import { useRecoilValue } from 'recoil'
import { selectValidatorUrl } from '../recoil/selectors/selectValidatorUrl'
import { apiToken } from '../recoil/atoms'
import { fetchValidatorGraffiti } from '../api/lighthouse'

const useValidatorGraffiti = (validator?: ValidatorInfo) => {
  const validatorUrl = useRecoilValue(selectValidatorUrl)
  const token = useRecoilValue(apiToken)
  const [results, setResults] = useState<ValidatorGraffitiResults | undefined>()

  const fetchGraffiti = async (url: string, token: string) => {
    try {
      const { data } = await fetchValidatorGraffiti(url, token)

      if (data) {
        setResults(data.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (token) {
      void fetchGraffiti(validatorUrl, token)
    }
  }, [token, validatorUrl])

  const validatorGraffiti = useMemo(() => {
    if (!validator || !results) return
    return results[validator.pubKey]
  }, [validator, results])

  return {
    graffiti: validatorGraffiti,
  }
}

export default useValidatorGraffiti
