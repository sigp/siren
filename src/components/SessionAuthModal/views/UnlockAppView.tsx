import Typography from '../../Typography/Typography'
import Button, { ButtonFace } from '../../Button/Button'
// import { useSetRecoilState } from 'recoil'
// import { isAppLockdown  } from '../../../recoil/atoms'
import Input from '../../Input/Input'
import { useState, ChangeEvent } from 'react'
import useUiMode from '../../../hooks/useUiMode'
import addClassString from '../../../utilities/addClassString'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { SessionAuthStorage } from '../../../types'
import { AppView, OnboardView } from '../../../constants/enums'
import { useSetRecoilState } from 'recoil'
import { appView, isSessionAuthModal, onBoardView } from '../../../recoil/atoms'

const UnlockAppView = () => {
  const [sessionAuth] = useLocalStorage<SessionAuthStorage | undefined>('session-auth', undefined)
  const [, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)
  const setAuthModal = useSetRecoilState(isSessionAuthModal)
  // const setAppLockdown = useSetRecoilState(isAppLockdown)
  const { mode } = useUiMode()

  const classes = addClassString('', [isError && 'animate-shake'])

  const setInput = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

  const viewConfig = () => {
    storeApiToken('')
    setView(OnboardView.CONFIGURE)
    setAppView(AppView.ONBOARD)
    setAuthModal(false)
  }

  const unlockApp = () => {
    setIsError(true)

    // setAppLockdown(false)
    // setAuthModal(false)

    setTimeout(() => {
      setIsError(false)
    }, 1000)
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
      {sessionAuth?.password ? renderPasswordInput() : renderNoPasswordRedirect()}
    </div>
  )
}

export default UnlockAppView
