import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorCandidate } from '../../../../../types'
import Input from '../../../../Input/Input'
import ValidatorCandidateRow from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'
import { ValidatorCandidateRowProps } from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'

export interface KeystoreAuthRowProps extends Pick<ValidatorCandidateRowProps, 'index'> {
  candidate: ValidatorCandidate
  onConfirmation: (id: string, password: string) => void
}

const KeystoreAuthRow: FC<KeystoreAuthRowProps> = ({ candidate, index, onConfirmation }) => {
  const { t } = useTranslation()
  const { id } = candidate
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')

  const isComplete = Boolean(password && confirmationPassword)
  const isMatchingPassword = password === confirmationPassword
  const isValid = isComplete && isMatchingPassword

  const errorMessages = useMemo(() => {
    const rules = [
      { test: /.{12,}/, error: t('error.length') },
      { test: /[a-z]/, error: t('error.lowercaseRequired') },
      { test: /[A-Z]/, error: t('error.uppercaseRequired') },
      { test: /[0-9]/, error: t('error.numberRequired') },
      { test: /[$&+,:;=?@#|'<>.^*()%!-]/, error: t('error.specialCharRequired') },
    ]

    return password
      ? rules.filter((rule) => !rule.test.test(password)).map((rule) => rule.error)
      : []
  }, [password])

  const storePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const storeConfirmationPassword = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmationPassword(e.target.value)

  useEffect(() => {
    if (isComplete) {
      onConfirmation(id, isMatchingPassword ? confirmationPassword : '')
    }
  }, [isMatchingPassword, isComplete, confirmationPassword, id])

  return (
    <ValidatorCandidateRow
      isError={Boolean(errorMessages.length) || !isMatchingPassword}
      data={candidate}
      index={index !== undefined ? Number(index) : undefined}
    >
      <div className='p-8 flex-1 space-y-12'>
        <div className='relative'>
          {isValid && (
            <i className='bi bi-check text-success text-caption 2xl:text-subtitle3 absolute top-2 -left-5' />
          )}
          <Input
            placeholder={t('password')}
            error={errorMessages.length ? errorMessages.join(' • ') : undefined}
            className='text-caption1'
            inputStyle='secondary'
            type='password'
            onChange={storePassword}
          />
        </div>
        <div className='relative'>
          {isValid && (
            <i className='bi bi-check text-success text-caption 2xl:text-subtitle3 absolute top-2 -left-5' />
          )}
          <Input
            placeholder={t('confirmPassword')}
            error={!isMatchingPassword ? t('error.passwordMatch') : undefined}
            inputStyle='secondary'
            type='password'
            className='text-caption1'
            onChange={storeConfirmationPassword}
          />
        </div>
      </div>
    </ValidatorCandidateRow>
  )
}

export default KeystoreAuthRow
