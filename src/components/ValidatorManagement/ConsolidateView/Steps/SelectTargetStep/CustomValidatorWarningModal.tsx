import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonFace } from '../../../../Button/Button'
import RodalModal from '../../../../RodalModal/RodalModal'
import Typography from '../../../../Typography/Typography'

export interface CustomValidatorWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

const CustomValidatorWarningModal: FC<CustomValidatorWarningModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const { t } = useTranslation()

  return (
    <RodalModal onClose={onClose} styles={{ maxWidth: '500px' }} isVisible={isOpen}>
      <div className='w-full h-full flex flex-col p-6 space-y-6 items-center justify-center'>
        <i className='bi-exclamation-triangle text-6xl text-error' />
        <div className='space-y-4 text-center'>
          <Typography type='text-subtitle1' className='text-center'>
            {t('validatorManagement.consolidateView.customValidatorWarning.title')}
          </Typography>
          <Typography type='text-caption1' className='text-center'>
            {t('validatorManagement.consolidateView.customValidatorWarning.description')}
          </Typography>
          <Typography type='text-caption1' className='text-center text-error'>
            {t('validatorManagement.consolidateView.customValidatorWarning.warning')}
          </Typography>
        </div>
        <div className='flex space-x-4'>
          <Button onClick={onClose} type={ButtonFace.TERTIARY}>
            {t('cancel')}
          </Button>
          <Button onClick={onAccept} type={ButtonFace.SECONDARY}>
            {t('validatorManagement.consolidateView.customValidatorWarning.accept')}
          </Button>
        </div>
      </div>
    </RodalModal>
  )
}

export default CustomValidatorWarningModal
