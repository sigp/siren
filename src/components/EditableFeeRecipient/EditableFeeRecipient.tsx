import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import formatEthAddress from '../../../utilities/formatEthAddress'
import isEthereumAddress from '../../../utilities/isEthereumAddress'
import useUiMode from '../../hooks/useUiMode'
import { ToastType } from '../../types'
import AuthPrompt from '../AuthPrompt/AuthPrompt'
import Button, { ButtonFace } from '../Button/Button'
import RodalModal from '../RodalModal/RodalModal'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

export interface EditableFeeRecipientProps {
  feeRecipient: string | undefined
  pubKey: string
  onUpdate?: (newFeeRecipient: string) => void
}

const EditableFeeRecipient: FC<EditableFeeRecipientProps> = ({
  feeRecipient,
  pubKey,
  onUpdate,
}) => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(feeRecipient || '')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setAuth] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    setEditValue(feeRecipient || '')
  }, [feeRecipient])

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(false)
    setEditValue(feeRecipient || '')
    setError(null)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Validate Ethereum address
    if (!isEthereumAddress(editValue)) {
      setError('Invalid Ethereum address format')
      return
    }

    setError(null)
    setShowConfirmation(true)
  }

  const handleConfirmationProceed = () => {
    setShowConfirmation(false)
    setAuth(true)
  }

  const handleConfirmationCancel = () => {
    setShowConfirmation(false)
  }

  const updateFeeRecipient = async (password: string) => {
    setIsLoading(true)
    setAuth(false)

    try {
      const response = await fetch('/api/update-fee-recipient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          pubKey,
          feeRecipient: editValue,
          password,
        }),
      })

      setIsLoading(false)

      if (response.ok) {
        displayToast(t('validatorEdit.feeRecipient.successUpdate'), ToastType.SUCCESS)
        setIsEditing(false)
        onUpdate?.(editValue)
      } else {
        // Check if it's a password authentication error (401)
        if (response.status === 401) {
          const errorMessage = t('validatorEdit.feeRecipient.incorrectPassword')
          setError(errorMessage)
          displayToast(errorMessage, ToastType.ERROR)
        } else {
          const data = await response.json().catch(() => ({}))
          const errorMessage =
            typeof data.error === 'string'
              ? data.error
              : data.message || t('validatorEdit.feeRecipient.errorUpdate')
          setError(errorMessage)
          displayToast(t('validatorEdit.feeRecipient.errorUpdate'), ToastType.ERROR)
        }
      }
    } catch (err) {
      setIsLoading(false)
      console.error('Error updating fee recipient:', err)
      const errorMessage =
        err instanceof Error ? err.message : t('validatorEdit.feeRecipient.unexpectedError')
      setError(errorMessage)
      displayToast(t('validatorEdit.feeRecipient.unexpectedError'), ToastType.ERROR)
    }
  }

  const closeAuth = () => setAuth(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
    setError(null)
  }

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      <RodalModal
        isVisible={showConfirmation}
        onClose={handleConfirmationCancel}
        styles={{ maxWidth: '500px' }}
      >
        <div className='p-6'>
          <Typography type='text-subtitle1' color='text-dark500' className='mb-4'>
            {t('validatorEdit.feeRecipient.confirmTitle', 'Confirm fee recipient update')}
          </Typography>
          <div className='space-y-4'>
            <Typography type='text-caption1' color='text-dark500' className='leading-relaxed'>
              {t(
                'validatorEdit.feeRecipient.confirmMessage',
                'Updating fee recipient in Siren will replace the fee recipients set in the validator client and/or beacon node using --suggested-fee-recipient',
              )}
            </Typography>
          </div>
          <div className='flex gap-2 justify-end mt-6'>
            <Button type={ButtonFace.TERTIARY} onClick={handleConfirmationCancel}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type={ButtonFace.SECONDARY} onClick={handleConfirmationProceed}>
              {t('common.proceed', 'Proceed')}
            </Button>
          </div>
        </div>
      </RodalModal>
      <AuthPrompt
        isLoading={isLoading}
        mode={mode}
        onClose={closeAuth}
        isVisible={isAuth}
        onSubmit={updateFeeRecipient}
      />
      {isEditing ? (
        <div className='flex flex-col items-center gap-1' onClick={(e) => e.stopPropagation()}>
          <div className='flex items-center gap-1'>
            <input
              type='text'
              value={editValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              placeholder='0x...'
              disabled={isLoading}
              className='w-80 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark750 text-dark500 dark:text-white focus:outline-none focus:border-primary font-mono'
            />
            <button
              onClick={handleSave}
              disabled={isLoading}
              className='px-2 py-1 text-xs bg-success text-white rounded hover:bg-green-600 disabled:opacity-50'
            >
              <i className='bi-check-lg' />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className='px-2 py-1 text-xs bg-error text-white rounded hover:bg-red-600 disabled:opacity-50'
            >
              <i className='bi-x-lg' />
            </button>
          </div>
          {error && (
            <Typography type='text-tiny' color='text-error' className='text-center'>
              {error}
            </Typography>
          )}
        </div>
      ) : (
        <div className='flex items-center gap-2 group cursor-pointer' onClick={handleEdit}>
          {feeRecipient ? (
            <Tooltip
              id={`fee-${pubKey}`}
              place='top-start'
              style={{ fontSize: '12px' }}
              text={feeRecipient}
            >
              <Typography
                color='text-dark500'
                type='text-caption1'
                className='text-center w-fit mx-auto'
              >
                {formatEthAddress(feeRecipient)}
              </Typography>
            </Tooltip>
          ) : (
            <Typography color='text-dark500' type='text-caption1' className='text-center'>
              -
            </Typography>
          )}
          <i className='bi-pencil text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
        </div>
      )}
    </>
  )
}

export default EditableFeeRecipient
