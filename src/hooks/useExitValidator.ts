import { SignedExitData } from '../types/validator'
import { signVoluntaryExit } from '../api/lighthouse'
import displayToast from '../utilities/displayToast'
import { ToastType } from '../types'
import { submitSignedExit } from '../api/beacon'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const useExitValidator = (apiToken: string, pubKey: string, beaconUrl: string) => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)

  const getSignedExit = async (url: string): Promise<SignedExitData | undefined> => {
    try {
      const { data } = await signVoluntaryExit(url, apiToken, pubKey)

      if (data) {
        return data?.data || data
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('error.unableToSignExit'), ToastType.ERROR)
    }
  }
  const submitSignedMessage = async (data: SignedExitData) => {
    try {
      const { status } = await submitSignedExit(beaconUrl, data)

      if (status === 200) {
        setLoading(false)
        displayToast(t('success.validatorExit'), ToastType.SUCCESS)
      }
    } catch (e) {
      setLoading(false)
      displayToast(t('error.invalidExit'), ToastType.ERROR)
    }
  }

  return {
    isLoading,
    setLoading,
    getSignedExit,
    submitSignedMessage,
  }
}

export default useExitValidator
