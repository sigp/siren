import { verifyMessage, isAddress } from 'ethers'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSignMessage } from 'wagmi'
import addClassString from '../../../utilities/addClassString'
import { ValidatorCandidate } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import Typography from '../Typography/Typography'
import ValidatorCandidateRow from '../ValidatorCandidateRow/ValidatorCandidateRow'
import WalletActionBtn from '../WalletActionBtn/WalletActionBtn'

export interface ValidatorCredentialRowProps {
  validator: ValidatorCandidate
  onSetCredential: (id: string, credential: string) => void
  onSetVerification: (id: string, verification: boolean) => void
}

const ValidatorCredentialRow: FC<ValidatorCredentialRowProps> = ({
  validator,
  onSetCredential,
  onSetVerification,
}) => {
  const { t } = useTranslation()
  const { id, index, isVerifiedCredentials } = validator
  const [credentialInput, setCredentialInput] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [errorMsg, setError] = useState('')
  const messageSignature = t('validatorManagement.withdrawalCredentials.confirmOwnership')

  const { data, signMessage, error } = useSignMessage()

  const setCredential = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSetCredential(id, '')
    setError('')
    setCredentialInput(value)
    onSetVerification(id, false)

    const isValid = isAddress(value)

    if (!isValid) {
      setError(t('validatorManagement.withdrawalCredentials.invalidAddress'))
      return
    }

    onSetCredential(id, value)
    setIsValidAddress(isValid)
  }

  const verifyCredentials = () => {
    setLoading(true)
    setError('')
    signMessage({ message: messageSignature })
  }

  useEffect(() => {
    if (!data) return

    const signedAddress = verifyMessage(messageSignature, data)

    if (signedAddress === credentialInput) {
      onSetVerification(id, true)
    } else {
      onSetVerification(id, false)
      setError(t('validatorManagement.withdrawalCredentials.incorrectSignature'))
    }
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (error) {
      console.log(error)
      setLoading(false)
    }
  }, [error])

  const inputClasses = addClassString(
    'w-full h-full text-dark900 dark:text-dark300 dark:bg-dark600_20 font-openSauce text-caption1 p-2 outline-none bg-transparent border-style',
    [errorMsg && 'border-error'],
  )
  const containerClasses = addClassString('w-full relative flex items-center max-w-[500px] pr-4', [
    errorMsg && 'h-24',
  ])

  return (
    <ValidatorCandidateRow
      isError={Boolean(errorMsg)}
      data={validator}
      index={index ? Number(index) : undefined}
    >
      <div className={containerClasses}>
        <div className='flex h-[32px] w-full h-full items-center'>
          <div className='w-full relative'>
            <input
              value={credentialInput}
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
              <WalletActionBtn textSize='text-caption1'>
                <Button
                  padding='px-4 py-1'
                  className='py-1'
                  isLoading={isLoading}
                  isDisabled={!credentialInput || !isValidAddress}
                  onClick={verifyCredentials}
                  type={ButtonFace.TERTIARY}
                >
                  {t('verify')}
                </Button>
              </WalletActionBtn>
            </div>
          ) : null}
        </div>
        {errorMsg ? (
          <div className='absolute bottom-1 left-0'>
            <Typography color='text-error' darkMode='dark:text-error' type='text-caption1'>
              {errorMsg}
            </Typography>
          </div>
        ) : null}
      </div>
    </ValidatorCandidateRow>
  )
}

export default ValidatorCredentialRow
