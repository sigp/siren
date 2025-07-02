import { ChangeEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const usePasswordConfirmation = () => {
  const { t } = useTranslation()

  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const errorMessages = useMemo(() => {
    const rules = [
      { test: /.{12,}/, error: t('error.length') },
      { test: /[a-z]/, error: t('error.lowercaseRequired') },
      { test: /[A-Z]/, error: t('error.uppercaseRequired') },
      { test: /[0-9]/, error: t('error.numberRequired') },
      { test: /[$&+,:;=?@#|'<>.^*()%!-]/, error: t('error.specialCharRequired') },
    ]

    return password
      ? rules.filter((rule) => !rule.test.test(password)).map((rule) => rule.error)
      : []
  }, [password])
  const isComplete = Boolean(password && confirmationPassword)
  const isMatchingPassword = password === confirmationPassword
  const isValid = isComplete && isMatchingPassword && !errorMessages.length

  const storePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const storeConfirmationPassword = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmationPassword(e.target.value)

  return {
    password,
    error: errorMessages.length ? errorMessages.join(' • ') : undefined,
    confirmationError: !isMatchingPassword ? t('error.passwordMatch') : undefined,
    isMatchingPassword,
    confirmationPassword,
    isValid,
    storePassword,
    storeConfirmationPassword,
  }
}

export default usePasswordConfirmation
