import { createContext, useEffect, useState } from 'react'
import ValidatorDetails from './views/ValidatorDetails'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Spinner from '../Spinner/Spinner'
import { selectValidatorDetail } from '../../recoil/selectors/selectValidatorDetails'
import { validatorIndex } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import RodalModal from '../RodalModal/RodalModal'
import { ValidatorModalView } from '../../constants/enums'
import ValidatorExit from './views/ValidatorExit'
import Carousel from 'nuka-carousel'

export interface ValidatorModalContextProps {
  moveToView: (view: ValidatorModalView) => void
  closeModal: () => void
}

export const ValidatorModalContext = createContext<ValidatorModalContextProps>({
  moveToView: () => {},
  closeModal: () => {},
})

const ValidatorModal = () => {
  const [isReady, setReady] = useState(false)
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const [activeIndex, setIndex] = useState(0)
  const [view, setView] = useState<ValidatorModalView>(ValidatorModalView.EXIT)
  const isTablet = useMediaQuery('(max-width: 768px)')
  const isLargeScreen = useMediaQuery('(min-width: 1540px)')

  useEffect(() => {
    setReady(true)
  }, [])

  const closeModal = () => {
    setValidatorIndex(undefined)
    setTimeout(() => {
      setView(ValidatorModalView.DETAILS)
      setIndex(0)
    }, 1000)
  }
  const renderContent = () => {
    if (!validator) return null

    switch (view) {
      case ValidatorModalView.EXIT:
        return <ValidatorExit validator={validator} />
      default:
        return <div />
    }
  }

  const moveToView = (view: ValidatorModalView) => {
    if (view === ValidatorModalView.DETAILS) {
      setIndex(0)
      setTimeout(() => {
        setView(view)
      }, 200)
      return
    }

    setView(view)
    setTimeout(() => {
      setIndex(1)
    }, 200)
  }

  return (
    <RodalModal
      isVisible={!!validator && isReady}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '99%' : isLargeScreen ? '1200px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      {validator ? (
        <ValidatorModalContext.Provider value={{ moveToView, closeModal }}>
          <Carousel swiping={false} slideIndex={activeIndex} dragging={false} withoutControls>
            <ValidatorDetails />
            {renderContent()}
          </Carousel>
        </ValidatorModalContext.Provider>
      ) : (
        <div className='w-500 h-640 flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </RodalModal>
  )
}

export default ValidatorModal
