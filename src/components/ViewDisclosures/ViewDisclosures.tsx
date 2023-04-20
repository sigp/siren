import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'
import Button, { ButtonFace } from '../Button/Button'
import SessionAuthModal from '../SessionAuthModal/SessionAuthModal'
import useUiMode from '../../hooks/useUiMode'

export interface ViewDisclosuresProps {
  onClick?: () => void
  onAccept?: () => void
  ctaText?: string
  isSensitive?: boolean
  isDisabled?: boolean
  ctaType?: ButtonFace
}

const ViewDisclosures: FC<ViewDisclosuresProps> = ({
  onClick,
  onAccept,
  ctaText,
  ctaType,
  isDisabled,
  isSensitive,
}) => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const [isSessionModal, toggleAuthModal] = useState(false)

  const closeAuthModal = () => toggleAuthModal(false)
  const openAuthModal = () => toggleAuthModal(true)

  const onSuccessAuth = () => {
    closeAuthModal()
    onAccept?.()
  }

  const renderCta = () => {
    if (!onAccept || !ctaText) return null

    if (isSensitive) {
      return (
        <SessionAuthModal
          mode={mode}
          onSuccess={onSuccessAuth}
          isOpen={isSessionModal}
          onClose={closeAuthModal}
        >
          <Button isDisabled={isDisabled} type={ctaType} onClick={openAuthModal}>
            {ctaText}
          </Button>
        </SessionAuthModal>
      )
    }

    return (
      <Button isDisabled={isDisabled} type={ctaType} onClick={onAccept}>
        {ctaText}
      </Button>
    )
  }

  return (
    <div className='flex space-x-4 items-center justify-between'>
      <div onClick={onClick} className='flex space-x-4 items-center cursor-pointer'>
        <i className='bi-info-circle text-caption1 text-primary' />
        <Typography
          isBold
          family='font-archivo'
          color='text-primary'
          type='text-caption1'
          isUpperCase
        >
          {t('viewDisclosures')}
        </Typography>
      </div>
      {renderCta()}
    </div>
  )
}

export default ViewDisclosures
