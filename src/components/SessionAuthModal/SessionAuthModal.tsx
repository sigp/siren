import RodalModal from '../RodalModal/RodalModal'
import { useSetRecoilState } from 'recoil'
import { appView, onBoardView } from '../../recoil/atoms'
import Typography from '../Typography/Typography'
import useLocalStorage from '../../hooks/useLocalStorage'
import { ChangeEvent, FC, ReactElement, useState } from 'react'
import addClassString from '../../utilities/addClassString'
import { AppView, OnboardView, UiMode } from '../../constants/enums'
import CryptoJS from 'crypto-js'
import Button, { ButtonFace } from '../Button/Button'
import Input from '../Input/Input'
import { MAX_SESSION_UNLOCK_ATTEMPTS } from '../../constants/constants'

export interface SessionAuthModalProps {
  onSuccess: (token?: string) => void
  isOpen: boolean
  onClose?: () => void
  children?: ReactElement | ReactElement[]
  mode?: UiMode
}

const SessionAuthModal: FC<SessionAuthModalProps> = ({
  onSuccess,
  children,
  isOpen,
  onClose,
  mode,
}) => {
  const [apiToken, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [password, setPassword] = useState('')
  const [errorCount, setCount] = useState(0)
  const [isError, setIsError] = useState(false)
  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)

  const classes = addClassString('', [isError && 'animate-shake'])

  const setInput = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

  const viewConfig = () => {
    storeApiToken('')
    setView(OnboardView.CONFIGURE)
    setAppView(AppView.ONBOARD)
  }

  const playErrorAnim = () => {
    setIsError(true)

    setTimeout(() => {
      setIsError(false)
    }, 1000)
  }

  const handleError = () => {
    playErrorAnim()
    setCount((prevState) => prevState + 1)
  }

  const authenticateAction = () => {
    const pattern = /^api-token-0x\w*$/
    try {
      const token = CryptoJS.AES.decrypt(apiToken, password).toString(CryptoJS.enc.Utf8)
      if (!token.length || !pattern.test(token)) {
        handleError()
        return
      }
      setCount(0)
      onSuccess(token)
    } catch (e) {
      handleError()
    }
  }

  const renderNoPasswordRedirect = () => (
    <>
      <Typography type='text-caption1'>
        Access to privileged validator actions is currently restricted. To regain access, please
        revisit the configuration settings and initiate a new session.
      </Typography>
      <div className='w-full flex justify-center p-4'>
        <Button className={classes} onClick={viewConfig} type={ButtonFace.SECONDARY}>
          <i className='bi bi-box-arrow-right text-white mr-2' />
          Configuration Settings
        </Button>
      </div>
    </>
  )
  const renderPasswordInput = () => (
    <>
      <Typography type='text-caption1'>
        Access to sensitive validator actions is currently restricted. To regain access, please
        enter the password. Please be aware that you have a maximum of three attempts to unlock
        these actions.
      </Typography>
      <Input
        uiMode={mode}
        type='password'
        label='Confirm Password'
        value={password}
        onChange={setInput}
      />
      <div className='w-full flex justify-center p-4'>
        <Button
          isDisabled={!password}
          className={classes}
          onClick={authenticateAction}
          type={ButtonFace.SECONDARY}
        >
          <i className='bi bi-unlock-fill text-white mr-2' />
          Unlock Validator Actions
        </Button>
      </div>
    </>
  )

  return (
    <>
      <RodalModal onClose={onClose} isVisible={isOpen}>
        <div className='p-4'>
          <div className='border-b-style500 pb-4 mb-4'>
            <Typography>Validator Authentication</Typography>
          </div>
          <div className='w-full space-y-4'>
            {errorCount < MAX_SESSION_UNLOCK_ATTEMPTS
              ? renderPasswordInput()
              : renderNoPasswordRedirect()}
          </div>
        </div>
      </RodalModal>
      {children}
    </>
  )
}

export default SessionAuthModal
