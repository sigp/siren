import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isAppLockdown, isSessionAuthModal } from '../../recoil/atoms'
import LockDownApp from './views/LockDownApp'
import UnlockAppView from './views/UnlockAppView'
import Typography from '../Typography/Typography'

const SessionAuthModal = () => {
  const [isModal, toggleModal] = useRecoilState(isSessionAuthModal)
  const isLocked = useRecoilValue(isAppLockdown)

  const closeModal = () => toggleModal(false)

  return (
    <RodalModal onClose={closeModal} isVisible={isModal}>
      <div className='p-4'>
        <div className='border-b-style500 pb-4 mb-4'>
          <Typography>Session Authentication</Typography>
        </div>
        {isLocked ? <UnlockAppView /> : <LockDownApp />}
      </div>
    </RodalModal>
  )
}

export default SessionAuthModal
