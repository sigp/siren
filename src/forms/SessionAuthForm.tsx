import { FC, ReactElement, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { sessionAuthValidation } from '../validation/sessionAuthValidation'
import { OnboardView } from '../constants/enums'
import { useSetRecoilState } from 'recoil'
import { onBoardView } from '../recoil/atoms'
import { toast } from 'react-toastify'
import useLocalStorage from '../hooks/useLocalStorage'
import { SessionAuthStorage } from '../types'
import { DEFAULT_TIMEOUT_LENGTH } from '../constants/constants'
import { OptionType } from '../components/SelectDropDown/SelectDropDown'
import CryptoJS from 'crypto-js'
import { ENCRYPT_KEY } from '../constants/window'

export interface SessionAuthForm {
  password: string
  password_confirmation: string
}

export interface RenderProps {
  control: Control<SessionAuthForm>
  sessionTime: OptionType
  isLoading: boolean
  onSubmit: () => void
  setTime: (time: OptionType) => void
}

export interface SessionAuthFormProps {
  children: (props: RenderProps) => ReactElement
}

const SessionAuthForm: FC<SessionAuthFormProps> = ({ children }) => {
  const setView = useSetRecoilState(onBoardView)
  const viewSetup = () => setView(OnboardView.SETUP)
  const [sessionTime, setTime] = useState<OptionType>(DEFAULT_TIMEOUT_LENGTH)
  const [, storeSessionAuth] = useLocalStorage<SessionAuthStorage | undefined>(
    'session-auth',
    undefined,
  )

  const {
    control,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
    resolver: yupResolver(sessionAuthValidation),
  })

  const password = watch('password')

  const onSubmit = () => {
    if (password && !isValid) {
      toast.error('Invalid SessionController Auth Password', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      })
      return
    }

    const encryptedPassword = password
      ? CryptoJS.AES.encrypt(password, ENCRYPT_KEY).toString()
      : undefined
    storeSessionAuth({
      password: encryptedPassword,
      delay: sessionTime === 'required' ? 0 : (sessionTime as number),
    })
    viewSetup()
  }

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isLoading: false,
          sessionTime,
          onSubmit,
          setTime,
        })}
    </form>
  )
}

export default SessionAuthForm
