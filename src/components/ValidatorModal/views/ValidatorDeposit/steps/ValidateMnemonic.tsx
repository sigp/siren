import clsx from 'clsx'
import { FC, InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '../../../../Spinner/Spinner'

export interface ValidateMnemonicProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  isValidKeyPhrase: boolean
  isValidated: boolean
}

const ValidateMnemonic: FC<ValidateMnemonicProps> = ({
  onChange,
  isValidKeyPhrase,
  value,
  isValidated,
  disabled,
}) => {
  const { t } = useTranslation()

  const textAreaClasses = clsx(
    'w-full text-dark900 dark:bg-dark600_20 dark:text-dark300 font-openSauce text-caption1 p-4 outline-none bg-transparent rounded-sm border pr-12',
    isValidKeyPhrase ? 'border-success' : isValidated ? 'border-error' : 'border-style',
  )

  return (
    <div className='relative'>
      {value && !isValidated && <Spinner size='w-6 h-6' className='absolute top-2 right-0' />}
      <textarea
        onChange={onChange}
        disabled={disabled}
        placeholder={t('validatorManagement.mnemonicPhrase.placeholder')}
        className={textAreaClasses}
        cols={30}
        rows={10}
      />
    </div>
  )
}

export default ValidateMnemonic
