import useSessionTimeout from '../../hooks/useSessionTimeout'
import { useSetRecoilState } from 'recoil'
import { isAppLockdown } from '../../recoil/atoms'
import { useEffect } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { SessionAuthStorage } from '../../types'
import { DEFAULT_TIMEOUT_LENGTH } from '../../constants/constants'

const SessionController = () => {
  const [sessionAuth] = useLocalStorage<SessionAuthStorage | undefined>('session-auth', undefined)
  const delay = sessionAuth?.delay || DEFAULT_TIMEOUT_LENGTH

  const { hasExpired } = useSessionTimeout(delay * 60 * 1000)

  const setAppLockdown = useSetRecoilState(isAppLockdown)

  useEffect(() => {
    if (hasExpired) {
      setAppLockdown(true)
    }
  }, [hasExpired])

  return null
}

export default SessionController
