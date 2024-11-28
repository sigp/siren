import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonFace } from '../../Button/Button'
import RodalModal from '../../RodalModal/RodalModal'
import Typography from '../../Typography/Typography'

export interface RiskModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

const RiskModal: FC<RiskModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { t } = useTranslation()
  return (
    <RodalModal onClose={onClose} styles={{ maxWidth: '450px' }} isVisible={isOpen}>
      <div className='w-full h-full flex flex-col p-6 space-y-6 items-center justify-center'>
        <i className='bi-exclamation-circle text-6xl text-warning' />
        <Typography type='text-caption1' className='text-center'>
          {t('validatorManagement.credentialRiskModal.text')}
        </Typography>
        <Button onClick={onAccept} type={ButtonFace.TERTIARY}>
          {t('understandAndAccept')}
        </Button>
      </div>
    </RodalModal>
  )
}

export default RiskModal
