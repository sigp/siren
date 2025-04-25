import axios from 'axios'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../utilities/displayToast'
import { ToastType } from '../types'
import useChainSafeKeyStore from './useChainSafeKeyStore'

export interface ImportValidatorParams {
  mnemonic: string
  index: number
  keyStorePassword: string
  suggestedFeeRecipient: string
  onSuccess?: () => void
  onError?: () => void
}

const useImportValidator = () => {
  const { t } = useTranslation()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { generateKeystore } = useChainSafeKeyStore()

  const importValidator = useCallback(
    async ({
      mnemonic,
      index,
      keyStorePassword,
      suggestedFeeRecipient,
      onSuccess,
      onError,
    }: ImportValidatorParams) => {
      setIsSuccess(false)
      setIsLoading(true)
      setIsError(false)

      try {
        if (index === undefined || index === null || !Number.isInteger(index)) {
          throw new Error('No validator index provided.')
        }
        if (!mnemonic) {
          throw new Error('No mnemonic provided.')
        }
        if (!keyStorePassword) {
          throw new Error('No keystore password provided.')
        }

        if (!suggestedFeeRecipient) {
          throw new Error('No Suggested Fee Recipient provided')
        }

        const keyStore = await generateKeystore(
          mnemonic,
          index,
          keyStorePassword,
          suggestedFeeRecipient,
        )
        const response = await axios.post('/api/validator-import', { data: keyStore })

        if (response.status === 200) {
          setIsSuccess(true)
          onSuccess?.()
        } else {
          throw new Error('Failed to import validator. Server responded with non-200 status.')
        }
      } catch (e) {
        console.error('Import Validator Error:', e)
        onError?.()
        setIsError(true)
        displayToast(t('error.unexpectedValidatorImportError'), ToastType.ERROR)
      } finally {
        setIsLoading(false)
      }
    },
    [generateKeystore, t],
  )

  return {
    isLoading,
    isSuccess,
    isError,
    importValidator,
  }
}

export default useImportValidator
