import React, { FC, ReactNode } from 'react'
import { UiMode } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import Button, { ButtonFace } from '../Button/Button'
import { useTranslation } from 'react-i18next'
import RodalModal from '../RodalModal/RodalModal'

export interface DisclosureModalProps {
  isOpen: boolean
  backgroundImage: string
  onClose: () => void
  externalUrl?: string
  externalTarget?: '_self' | '_blank'
  mode?: UiMode
  children: ReactNode
}

const DisclosureModal: FC<DisclosureModalProps> = ({
  isOpen,
  backgroundImage,
  onClose,
  externalUrl,
  mode,
  externalTarget,
  children,
}) => {
  const { t } = useTranslation()
  const isTablet = useMediaQuery('(max-width: 1024px)')

  return (
    <RodalModal
      isVisible={isOpen}
      onClose={onClose}
      uiMode={mode && { mode }}
      styles={{
        maxWidth: isTablet ? '448px' : '949px',
      }}
    >
      <div className='w-full h-full flex'>
        <div
          className='hidden lg:block flex-shrink-0 w-80 bg-dark100'
          style={{
            backgroundImage: `Url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className='p-10 flex flex-col justify-between'>
          <div>{children}</div>
          {externalUrl && (
            <Button target={externalTarget} href={externalUrl} type={ButtonFace.SECONDARY}>
              {t('learnMore')} <i className='bi-arrow-right ml-2' />
            </Button>
          )}
        </div>
      </div>
    </RodalModal>
  )
}

export default DisclosureModal
