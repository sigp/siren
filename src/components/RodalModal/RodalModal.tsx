import { FC, ReactElement } from 'react'
import Rodal from 'rodal'
import { UiMode } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import useUiMode from '../../hooks/useUiMode'

export interface RodalModalProps {
  children: ReactElement | ReactElement[]
  onAnimationEnd?: () => never
  isVisible: boolean
  onClose?: () => void
  uiMode?: { mode: UiMode } | undefined
  maxWidth?: number
  styles?: {
    backgroundColor?: string
    width?: string
    maxWidth?: string
    height?: string
    maxHeight?: string
    overflow?: string
    zIndex?: number
  }
}

const RodalModal: FC<RodalModalProps> = ({
  children,
  isVisible,
  uiMode,
  onClose,
  styles,
  onAnimationEnd,
}) => {
  const { mode } = useUiMode()

  const uiStyle = uiMode || mode
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const {
    backgroundColor = uiStyle === UiMode.DARK ? '#1E1E1E' : 'white',
    width = '100%',
    maxWidth = isTablet ? '448px' : '649px',
    height = 'max-content',
    overflow = 'scroll',
    zIndex = 999,
    maxHeight,
  } = styles || {}

  const closeModal = () => onClose?.()

  return (
    <Rodal
      onAnimationEnd={onAnimationEnd as any}
      visible={isVisible}
      showCloseButton={!!onClose}
      onClose={closeModal}
      customStyles={{
        backgroundColor,
        width,
        maxWidth,
        height,
        maxHeight,
        overflow,
        zIndex,
      }}
    >
      {children}
    </Rodal>
  )
}

export default RodalModal
