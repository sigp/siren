import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import usePasswordConfirmation from '../../../../../../hooks/usePasswordConfirmation'
import Input from '../../../../../Input/Input'
import StepOptions, { StepOptionsProps } from '../../../../CreateValidatorView/StepOptions'

export interface ImportedKeystoreAuthenticationProps
  extends Omit<StepOptionsProps, 'isDisabledNext'> {
  onStoreAuth: (value: string) => void
}

const ImportedKeystoreAuthentication: FC<ImportedKeystoreAuthenticationProps> = ({
  onBackStep,
  onNextStep,
  onStoreAuth,
}) => {
  const { t } = useTranslation()
  const { password, error, confirmationError, isValid, storeConfirmationPassword, storePassword } =
    usePasswordConfirmation()
  const moveToNextStep = () => {
    onStoreAuth(password)
    onNextStep?.()
  }

  return (
    <div className='py-8'>
      <div className='relative'>
        {isValid && (
          <i className='bi bi-check text-success text-caption 2xl:text-subtitle3 absolute top-2 -left-5' />
        )}
        <Input
          placeholder={t('password')}
          error={error}
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
          error={confirmationError}
          inputStyle='secondary'
          type='password'
          className='text-caption1'
          onChange={storeConfirmationPassword}
        />
      </div>
      <StepOptions onBackStep={onBackStep} onNextStep={moveToNextStep} isDisabledNext={!isValid} />
    </div>
  )
}

export default ImportedKeystoreAuthentication
