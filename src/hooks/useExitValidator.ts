import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../utilities/displayToast'
import { submitSignedExit } from '../api/beacon'
import { signVoluntaryExit } from '../api/lighthouse'
import { ToastType } from '../types'
import { SignedExitData } from '../types/validator'

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
