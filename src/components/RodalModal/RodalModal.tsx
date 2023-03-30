import { UiMode } from '../../constants/enums'
import { FC, ReactElement } from 'react'
import Rodal from 'rodal'
import useUiMode from '../../hooks/useUiMode'
import useMediaQuery from '../../hooks/useMediaQuery'

export interface RodalModalProps {
  children: ReactElement | ReactElement[]
  isVisible: boolean
  onClose?: () => void
  uiMode?: { mode: UiMode }
  maxWidth?: number
  styles?: {
    backgroundColor?: string
    width?: string
    maxWidth?: string
    height?: string
    overflow?: string
    zIndex?: number
  }
}

const RodalModal: FC<RodalModalProps> = ({ children, isVisible, uiMode, onClose, styles }) => {
  const { mode } = uiMode || useUiMode()
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const {
    backgroundColor = mode === UiMode.DARK ? '#1E1E1E' : 'white',
    width = '100%',
    maxWidth = isTablet ? '448px' : '649px',
    height = 'max-content',
    overflow = 'scroll',
    zIndex = 999,
  } = styles || {}

  const closeModal = () => onClose?.()

  return (
    <Rodal
      visible={isVisible}
      showCloseButton={!!onClose}
      onClose={closeModal}
      customStyles={{
        backgroundColor,
        width,
        maxWidth,
        height,
        overflow,
        zIndex,
      }}
    >
      {children}
    </Rodal>
  )
}

export default RodalModal
