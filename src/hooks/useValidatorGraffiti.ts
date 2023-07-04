import { useEffect, useMemo, useState } from 'react'
import { ValidatorGraffitiResults, ValidatorInfo } from '../types/validator'
import { useRecoilValue } from 'recoil'
import { fetchValidatorGraffiti } from '../api/lighthouse'
import { activeDevice } from '../recoil/atoms'

const useValidatorGraffiti = (validator?: ValidatorInfo) => {
  const { apiToken, validatorUrl } = useRecoilValue(activeDevice)
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
    if (apiToken && validatorUrl) {
      void fetchGraffiti(validatorUrl, apiToken)
    }
  }, [apiToken, validatorUrl])

  const validatorGraffiti = useMemo(() => {
    if (!validator || !results) return
    return results[validator.pubKey]
  }, [validator, results])

  return {
    graffiti: validatorGraffiti,
  }
}

export default useValidatorGraffiti
