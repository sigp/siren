import clsx from 'clsx'
import { getAddress, verifyMessage } from 'ethers'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSignMessage } from 'wagmi'
import { Address } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import Typography from '../Typography/Typography'
import WalletActionGuard from '../WalletActionGuard/WalletActionGuard'

export interface CredentialInputProps {
  label?: string | undefined
  id: string
  value: string | undefined
  isVerifiedCredentials: boolean
  onVerify: (value: boolean) => void
  onChange: (value: string | undefined) => void
}

const CredentialInput: FC<CredentialInputProps> = ({
  label,
  id,
  isVerifiedCredentials,
  value,
  onVerify,
  onChange,
}) => {
  const { t } = useTranslation()
  const [errorMsg, setError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isValidAddress, setIsValidAddress] = useState(false)
  const messageSignature = t('validatorManagement.withdrawalCredentials.confirmOwnership')
  const { data, signMessage, error, reset } = useSignMessage()
  const containerClasses = clsx('w-full relative flex items-center pr-4')
  const inputClasses = clsx(
    'w-full h-full text-dark900 dark:text-dark300 dark:bg-dark600_20 font-openSauce text-caption1 p-2 outline-none bg-transparent border',
    errorMsg ? 'border-error100' : 'border-style',
  )

  const handleError = (e: any) => {
    let message = 'error.unexpectedAddressError'

    if (e?.code === 'INVALID_ARGUMENT') {
      message = 'error.invalidAddressFormat'
    }

    setError(t(message))
  }

  const verifyCredentials = () => {
    setLoading(true)
    setError('')
    signMessage({ message: messageSignature })
  }

  const setCredential = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(undefined)
    setError('')
    setIsValidAddress(false)
    reset()

    try {
      const value = e.target.value
      onChange(getAddress(value))
      setIsValidAddress(true)
    } catch (e) {
      handleError(e)
    }
  }

  useEffect(() => {
    if (!data || !value) return

    try {
      const signedAddress = verifyMessage(messageSignature, data)
      const checkSumAddress = getAddress(value)
      const isVerifiedCredentials = signedAddress === checkSumAddress

      onVerify(isVerifiedCredentials)

      if (!isVerifiedCredentials) {
        setError(t('validatorManagement.withdrawalCredentials.incorrectSignature'))
      }
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }, [data, t, value])

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  return (
    <div className='w-full space-y-2'>
      {!!label && (
        <label htmlFor={id}>
          <Typography type='text-caption1.5'>{label}</Typography>
        </label>
      )}
      <div className={containerClasses}>
        <div className='flex h-[32px] w-full h-full items-center'>
          <div className='w-full relative'>
            <input
              id={id}
              value={value}
              onChange={setCredential}
              className={inputClasses}
              type='text'
            />
            {isVerifiedCredentials && (
              <i className='bi-check-lg absolute right-5 text-success top-1/2 -translate-y-1/2' />
            )}
          </div>
          {!isVerifiedCredentials ? (
            <div className='full'>
              <WalletActionGuard targetAddress={value as Address} textSize='text-caption1'>
                <Button
                  padding='px-4 py-1'
                  className='py-1'
                  isLoading={isLoading}
                  isDisabled={!value || !isValidAddress}
                  onClick={verifyCredentials}
                  type={ButtonFace.TERTIARY}
                >
                  {t('verify')}
                </Button>
              </WalletActionGuard>
            </div>
          ) : null}
        </div>
      </div>
      {errorMsg ? (
        <div className=''>
          <Typography color='text-error' darkMode='dark:text-error' type='text-caption1.5'>
            {errorMsg}
          </Typography>
        </div>
      ) : null}
    </div>
  )
}

export default CredentialInput
