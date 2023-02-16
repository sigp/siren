import Rodal from 'rodal'
import React, { FC, ReactNode } from 'react'
import { UiMode } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import Button, { ButtonFace } from '../Button/Button'

export interface DisclosureModalProps {
  isOpen: boolean
  backgroundImage: string
  onClose: () => void
  mode?: UiMode
  children: ReactNode
}

const DisclosureModal: FC<DisclosureModalProps> = ({
  isOpen,
  backgroundImage,
  mode,
  onClose,
  children,
}) => {
  const isTablet = useMediaQuery('(max-width: 1024px)')

  return (
    <Rodal
      visible={isOpen}
      customStyles={{
        backgroundColor: mode ? '#1E1E1E' : 'white',
        width: '100%',
        maxWidth: isTablet ? '448px' : '949px',
        height: isTablet ? 'max-content' : '461px',
        overflow: 'scroll',
        zIndex: 999,
      }}
      onClose={onClose}
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
          <Button type={ButtonFace.SECONDARY}>
            Learn More <i className='bi-arrow-right ml-2' />
          </Button>
        </div>
      </div>
    </Rodal>
  )
}

export default DisclosureModal
