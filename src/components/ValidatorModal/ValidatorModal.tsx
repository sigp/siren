import { createContext, Dispatch, SetStateAction, useState } from 'react'
import ValidatorDetails from './views/ValidatorDetails'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Spinner from '../Spinner/Spinner'
import { selectValidatorDetail } from '../../recoil/selectors/selectValidatorDetails'
import { validatorIndex } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import RodalModal from '../RodalModal/RodalModal'
import { ValidatorModalView } from '../../constants/enums'
import ValidatorBls from './views/ValidatorBls'

export interface ValidatorModalContextProps {
  setView: Dispatch<SetStateAction<ValidatorModalView>>
  closeModal: () => void
}

export const ValidatorModalContext = createContext<ValidatorModalContextProps>({
  setView: () => {},
  closeModal: () => {},
})

const ValidatorModal = () => {
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const [view, setView] = useState<ValidatorModalView>(ValidatorModalView.DETAILS)
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const closeModal = () => {
    setValidatorIndex(undefined)
    setTimeout(() => {
      setView(ValidatorModalView.DETAILS)
    }, 1000)
  }

  const renderContent = () => {
    switch (view) {
      case ValidatorModalView.BLS:
        return <ValidatorBls />
      default:
        return <ValidatorDetails />
    }
  }
  return (
    <RodalModal
      isVisible={!!validator}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      {validator ? (
        <ValidatorModalContext.Provider value={{ setView, closeModal }}>
          {renderContent()}
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
