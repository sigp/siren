import { useState } from 'react';
import ValidatorDetails from './views/ValidatorDetails';
import Rodal from 'rodal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Spinner from '../Spinner/Spinner';
import { selectValidatorDetail } from '../../recoil/selectors/selectValidatorDetails';
import { validatorIndex } from '../../recoil/atoms';
import useUiMode from '../../hooks/useUiMode';
import useMediaQuery from '../../hooks/useMediaQuery';

const ValidatorModal = () => {
  const { mode } = useUiMode()
  const setValidatorIndex = useSetRecoilState(validatorIndex)
  const validator = useRecoilValue(selectValidatorDetail)
  const [view] = useState('');
  const isTablet = useMediaQuery('(max-width: 1024px)')

  const closeModal = () => setValidatorIndex(undefined)

  const renderContent = () => {
    switch (view) {
      default:
        return <ValidatorDetails/>
    }
  }
  return (
    <Rodal visible={!!validator} customStyles={{backgroundColor: mode === 'DARK' ? '#1E1E1E' : 'white', width: '100%', maxWidth: isTablet ? '448px' : '848px', height: isTablet ? '540px' : 'max-content', overflow: 'scroll'}} onClose={closeModal}>
      {validator ? renderContent() : (
        <div className="w-full h-640 flex items-center justify-center">
          <Spinner/>
        </div>
      )}
    </Rodal>
  )
}

export default ValidatorModal;