import { useState } from 'react'
import ValidatorDetails from './views/ValidatorDetails'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Spinner from '../Spinner/Spinner'
import { selectValidatorDetail } from '../../recoil/selectors/selectValidatorDetails'
import { validatorIndex } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import RodalModal from '../RodalModal/RodalModal'

const ValidatorModal = () => {
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const [view] = useState('')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const closeModal = () => setValidatorIndex(undefined)

  const renderContent = () => {
    switch (view) {
      default:
        return <ValidatorDetails />
    }
  }
  return (
    <RodalModal
      isVisible={!!validator}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '848px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      {validator ? (
        renderContent()
      ) : (
        <div className='w-full h-640 flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </RodalModal>
  )
}

export default ValidatorModal
