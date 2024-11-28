import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonFace } from '../../Button/Button'

export interface StepOptionsProps {
  onBackStep?: (() => void) | undefined
  onNextStep?: (() => void) | undefined
  isDisabledNext?: boolean
}

const StepOptions: FC<StepOptionsProps> = ({ onBackStep, onNextStep, isDisabledNext }) => {
  const { t } = useTranslation()

  return (
    <div className='flex space-x-4'>
      {onBackStep && (
        <Button type={ButtonFace.TERTIARY} onClick={onBackStep}>
          {t('back')}
        </Button>
      )}
      {onNextStep && (
        <Button isDisabled={isDisabledNext} type={ButtonFace.SECONDARY} onClick={onNextStep}>
          {t('next')}
        </Button>
      )}
    </div>
  )
}

export default StepOptions
