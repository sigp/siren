import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { ExcludedStatus } from '../types'
import { ValidatorStatus } from '../types/validator'

interface ExclusionListReturnType {
  exclusions: ExcludedStatus[]
  formattedExclusions: ValidatorStatus[]
  setExclusions: (
    value: ((prevState: ExcludedStatus[]) => ExcludedStatus[]) | ExcludedStatus[],
  ) => void
}

const useValidatorExclusionList = (initExclusions: ExcludedStatus[]): ExclusionListReturnType => {
  const [exclusions, setExclusions] = useState(initExclusions)
  const formattedExclusions = useMemo(() => {
    return exclusions.map(({ status }) => status)
  }, [exclusions])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get('/api/exclusions')
        setExclusions(data)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return {
    formattedExclusions,
    exclusions,
    setExclusions,
  }
}

export default useValidatorExclusionList
