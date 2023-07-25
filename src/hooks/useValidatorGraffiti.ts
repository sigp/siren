import { useEffect, useMemo, useState } from 'react'
import { ValidatorGraffitiResults, ValidatorInfo } from '../types/validator'
import { useRecoilValue } from 'recoil'
import { fetchValidatorGraffiti, updateValidator } from '../api/lighthouse'
import { activeDevice } from '../recoil/atoms'
import displayToast from '../utilities/displayToast'
import { useTranslation } from 'react-i18next'
import { ToastType } from '../types'

const useValidatorGraffiti = (validator?: ValidatorInfo) => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)
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
  const updateGraffiti = async (graffiti: string) => {
    const pubKey = validator?.pubKey

    if (!pubKey) return

    setLoading(true)

    try {
      const { status } = await updateValidator(validatorUrl, pubKey as string, apiToken, {
        graffiti,
      })

      setLoading(false)

      if (status === 200) {
        setResults((prev) => ({ ...prev, [pubKey]: graffiti }))
        displayToast(t('validatorEdit.graffiti.successUpdate'), ToastType.SUCCESS)
      } else {
        displayToast(t('validatorEdit.graffiti.unexpectedError'), ToastType.ERROR)
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('validatorEdit.graffiti.errorUpdate'), ToastType.ERROR)
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
    isLoading,
    graffiti: validatorGraffiti,
    updateGraffiti,
  }
}

export default useValidatorGraffiti
