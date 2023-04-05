import Typography from '../../Typography/Typography'
import Button, { ButtonFace } from '../../Button/Button'
import { useSetRecoilState } from 'recoil'
import { isAppLockdown, isSessionAuthModal } from '../../../recoil/atoms'

const LockDownApp = () => {
  const setAuthModal = useSetRecoilState(isSessionAuthModal)
  const setAppLockdown = useSetRecoilState(isAppLockdown)

  const lockApp = () => {
    setAuthModal(false)
    setAppLockdown(true)
  }

  return (
    <div className='w-full'>
      <Typography type='text-caption1'>
        Please note that sensitive validator actions in your Siren application are currently
        unlocked, which may pose a security risk if left unattended. To ensure the security of your
        application, we recommend locking these actions.
      </Typography>
      <div className='w-full flex justify-center p-4'>
        <Button onClick={lockApp} type={ButtonFace.SECONDARY}>
          <i className='bi bi-lock-fill text-white mr-2' />
          Lock Validator Actions
        </Button>
      </div>
    </div>
  )
}

export default LockDownApp
