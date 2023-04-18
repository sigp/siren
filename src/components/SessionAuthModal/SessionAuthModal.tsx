import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { apiToken, appView, onBoardView, sessionAuthErrorCount } from '../../recoil/atoms'
import Typography from '../Typography/Typography'
import useLocalStorage from '../../hooks/useLocalStorage'
import { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react'
import addClassString from '../../utilities/addClassString'
import { AppView, OnboardView, UiMode } from '../../constants/enums'
import CryptoJS from 'crypto-js'
import Button, { ButtonFace } from '../Button/Button'
import Input from '../Input/Input'
import { MAX_SESSION_UNLOCK_ATTEMPTS } from '../../constants/constants'
import { useTranslation } from 'react-i18next'

export interface SessionAuthModalProps {
  onSuccess: (token?: string) => void
  onFail?: () => void
  isOpen: boolean
  onClose?: () => void
  children?: ReactElement | ReactElement[]
  mode?: UiMode
}

const SessionAuthModal: FC<SessionAuthModalProps> = ({
  onSuccess,
  children,
  isOpen,
  onFail,
  onClose,
  mode,
}) => {
  const { t } = useTranslation()
  const [localStorageApiToken, storeApiToken] = useLocalStorage<string>('api-token', '')
  const memoryApiToken = useRecoilValue(apiToken)
  const [password, setPassword] = useState('')
  const [errorCount, setCount] = useRecoilState(sessionAuthErrorCount)
  const [isError, setIsError] = useState(false)
  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)

  useEffect(() => {
    if (errorCount >= MAX_SESSION_UNLOCK_ATTEMPTS) {
      onFail?.()
    }
  }, [errorCount])

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
    setPassword('')
    setCount((prevState) => prevState + 1)
  }

  const confirmApiToken = () => {
    if (password !== memoryApiToken) {
      handleError()
      return
    }

    setCount(0)
    onSuccess(memoryApiToken)
  }

  const confirmPassword = () => {
    const pattern = /^api-token-0x\w*$/
    try {
      const token = CryptoJS.AES.decrypt(localStorageApiToken, password).toString(CryptoJS.enc.Utf8)
      if (!token.length || !pattern.test(token)) {
        handleError()
        return
      }
      setCount(0)
      setPassword('')
      onSuccess(token)
    } catch (e) {
      handleError()
    }
  }

  const authenticateAction = () => {
    if (localStorageApiToken) {
      confirmPassword()
      return
    }

    confirmApiToken()
  }

  const renderNoPasswordRedirect = () => (
    <>
      <Typography type='text-caption1'>{t('sessionAuthModal.failedResponse')}</Typography>
      <div className='w-full flex justify-center p-4'>
        <Button className={classes} onClick={viewConfig} type={ButtonFace.SECONDARY}>
          <i className='bi bi-box-arrow-right text-white mr-2' />
          {t('sessionAuthModal.configSettings')}
        </Button>
      </div>
    </>
  )
  const renderPasswordInput = () => (
    <>
      <Typography type='text-caption1'>{t('sessionAuthModal.passwordPrompt')}</Typography>
      <Input uiMode={mode} type='password' label='Password' value={password} onChange={setInput} />
      <div className='w-full flex justify-center p-4'>
        <Button
          isDisabled={!password}
          className={classes}
          onClick={authenticateAction}
          type={ButtonFace.SECONDARY}
        >
          {t('confirmPassword')}
        </Button>
      </div>
    </>
  )

  const closeAuthModal = () => {
    onClose?.()
    setPassword('')
  }

  return (
    <>
      <RodalModal onClose={closeAuthModal} isVisible={isOpen}>
        <div className='p-4'>
          <div className='border-b-style500 pb-4 mb-4'>
            <Typography
              type='text-subtitle2'
              fontWeight='font-light'
              color='text-transparent'
              className='primary-gradient-text'
            >
              {t('sessionAuthModal.title')}
            </Typography>
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
