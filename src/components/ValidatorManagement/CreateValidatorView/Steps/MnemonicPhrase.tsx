import { debounce } from 'lodash'
import { FC, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../utilities/addClassString'
import displayToast from '../../../../../utilities/displayToast'
import useChainSafeKeygen from '../../../../hooks/useChainSafeKeygen'
import { ToastType } from '../../../../types'
import InfoBox, { InfoBoxType } from '../../../InfoBox/InfoBox'
import Spinner from '../../../Spinner/Spinner'
import Typography from '../../../Typography/Typography'
import StepOptions from '../StepOptions'

export interface MnemonicPhraseProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onNextStep: () => void
  onBackStep: () => void
  isActive: boolean
}

const MnemonicPhrase: FC<MnemonicPhraseProps> = ({
  onNextStep,
  onBackStep,
  onChange,
  value,
  isActive,
}) => {
  const { t } = useTranslation()
  const [isValidKeyPhrase, setIsValidPhrase] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const isEmpty = !value || !isValidated
  const isDisabledNext = isEmpty || !isValidKeyPhrase
  const textAreaClasses = addClassString(
    'w-full text-dark900 dark:bg-dark600_20 dark:text-dark300 font-openSauce text-caption1 p-4 outline-none bg-transparent rounded-sm border pr-12',
    [isEmpty ? 'border-style' : isValidKeyPhrase ? 'border-success' : 'border-error'],
  )

  const { generatePubKey } = useChainSafeKeygen()

  const validateKeyPhrase = async (phrase: string) => {
    try {
      await generatePubKey(phrase, 0)

      setIsValidPhrase(true)
      setIsValidated(true)
    } catch (e) {
      let message = t('validatorManagement.invalidMnemonic')
      setIsValidPhrase(false)
      setIsValidated(true)

      if (e instanceof Error && e.message.includes('NON_NEGATIVE_NUMBER')) {
        message = t('error.nonNegativeIndex')
      }

      if (e instanceof Error && e.message.includes('TOO_LARGE_INDEX')) {
        message = t('error.tooLargeIndex')
      }

      if (e instanceof Error && e.message.includes('INVALID_ADDRESS')) {
        message = t('error.invalidEthAddress')
      }

      displayToast(message, ToastType.ERROR)
      console.log(e)
    }
  }

  const debouncedValidateKeyPhraseRef = useRef(
    debounce((phrase: string) => {
      void validateKeyPhrase(phrase)
    }, 1000),
  )

  useEffect(() => {
    setIsValidated(false)
    if (!value) {
      return
    }

    debouncedValidateKeyPhraseRef.current(value as string)
  }, [value])

  return (
    <div className='w-full h-full space-y-6'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicPhrase.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.mnemonicPhrase.subtitle')}
        </Typography>
      </div>
      <div className='mt-4 w-full lg:w-[65%] space-y-8'>
        <InfoBox isActive={isActive} animDelay={0.4} type={InfoBoxType.NOTICE}>
          <div className='space-y-2'>
            <Typography type='text-caption1' darkMode='text-dark900' color='text-dark900'>
              {t('validatorManagement.mnemonicPhrase.warningText')}
            </Typography>
          </div>
        </InfoBox>
        <div className='relative'>
          {value && !isValidated && <Spinner size='w-6 h-6' className='absolute top-2 right-0' />}
          <textarea
            onChange={onChange}
            placeholder={t('validatorManagement.mnemonicPhrase.placeholder')}
            className={textAreaClasses}
            cols={30}
            rows={10}
          />
        </div>
      </div>
      <StepOptions
        onBackStep={onBackStep}
        onNextStep={onNextStep}
        isDisabledNext={isDisabledNext}
      />
    </div>
  )
}

export default MnemonicPhrase
