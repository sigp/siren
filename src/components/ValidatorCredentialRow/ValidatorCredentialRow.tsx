import { getAddress, verifyMessage } from 'ethers'
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
  validatorCandidate: ValidatorCandidate
  onUpdateCandidate: (id: string, candidate: ValidatorCandidate) => void
}

const ValidatorCredentialRow: FC<ValidatorCredentialRowProps> = ({
  validatorCandidate,
  onUpdateCandidate,
}) => {
  const { t } = useTranslation()
  const { id, index, isVerifiedCredentials } = validatorCandidate
  const [credentialInput, setCredentialInput] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [errorMsg, setError] = useState('')
  const messageSignature = t('validatorManagement.withdrawalCredentials.confirmOwnership')

  const { data, signMessage, error, reset } = useSignMessage()

  const handleError = (e: any) => {
    let message = 'error.unexpectedAddressError'

    if (e?.code === 'INVALID_ARGUMENT') {
      message = 'error.invalidAddressFormat'
    }

    setError(t(message))
  }

  const setCredential = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateCandidate(id, {
      ...validatorCandidate,
      withdrawalCredentials: undefined,
      isVerifiedCredentials: false,
    })
    setError('')
    setIsValidAddress(false)
    reset()

    try {
      const value = e.target.value
      setCredentialInput(value)
      const checkSumAddress = getAddress(value)
      onUpdateCandidate(id, { ...validatorCandidate, withdrawalCredentials: checkSumAddress })
      setIsValidAddress(true)
    } catch (e) {
      handleError(e)
    }
  }

  const verifyCredentials = () => {
    setLoading(true)
    setError('')
    signMessage({ message: messageSignature })
  }

  useEffect(() => {
    if (!data) return

    try {
      const signedAddress = verifyMessage(messageSignature, data)
      const checkSumAddress = getAddress(credentialInput)
      const isVerifiedCredentials = signedAddress === checkSumAddress

      onUpdateCandidate(id, { ...validatorCandidate, isVerifiedCredentials })

      if (!isVerifiedCredentials) {
        setError(t('validatorManagement.withdrawalCredentials.incorrectSignature'))
      }
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }, [data, validatorCandidate, credentialInput])

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
      data={validatorCandidate}
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
