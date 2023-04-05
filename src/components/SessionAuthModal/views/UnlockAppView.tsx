import Typography from '../../Typography/Typography'
import Button, { ButtonFace } from '../../Button/Button'
import Input from '../../Input/Input'
import { useState, ChangeEvent } from 'react'
import useUiMode from '../../../hooks/useUiMode'
import addClassString from '../../../utilities/addClassString'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { SessionAuthStorage } from '../../../types'
import { AppView, OnboardView } from '../../../constants/enums'
import { useSetRecoilState } from 'recoil'
import { appView, isSessionAuthModal, onBoardView, isAppLockdown } from '../../../recoil/atoms'
import CryptoJS from 'crypto-js'
import { MAX_SESSION_UNLOCK_ATTEMPTS } from '../../../constants/constants'
import { ENCRYPT_KEY } from '../../../constants/window'

const UnlockAppView = () => {
  const [sessionAuth] = useLocalStorage<SessionAuthStorage | undefined>('session-auth', undefined)
  const [, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [password, setPassword] = useState('')
  const [errorCount, setCount] = useState(0)
  const [isError, setIsError] = useState(false)
  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)
  const setAuthModal = useSetRecoilState(isSessionAuthModal)
  const setAppLockdown = useSetRecoilState(isAppLockdown)
  const { mode } = useUiMode()

  const classes = addClassString('', [isError && 'animate-shake'])

  const setInput = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

  const viewConfig = () => {
    storeApiToken('')
    setView(OnboardView.CONFIGURE)
    setAppView(AppView.ONBOARD)
    setAuthModal(false)
  }

  const isValidPassword = (password: string) => {
    if (!sessionAuth?.password) return false
    return (
      password ===
      CryptoJS.AES.decrypt(sessionAuth.password, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    )
  }

  const playErrorAnim = () => {
    setIsError(true)

    setTimeout(() => {
      setIsError(false)
    }, 1000)
  }

  const unlockApp = () => {
    if (!isValidPassword(password)) {
      playErrorAnim()
      setCount((prevState) => prevState + 1)
      return
    }

    setAppLockdown(false)
    setAuthModal(false)
    setCount(0)
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
          onClick={unlockApp}
          type={ButtonFace.SECONDARY}
        >
          <i className='bi bi-unlock-fill text-white mr-2' />
          Unlock Validator Actions
        </Button>
      </div>
    </>
  )

  return (
    <div className='w-full space-y-4'>
      {sessionAuth?.password && errorCount < MAX_SESSION_UNLOCK_ATTEMPTS
        ? renderPasswordInput()
        : renderNoPasswordRedirect()}
    </div>
  )
}

export default UnlockAppView
