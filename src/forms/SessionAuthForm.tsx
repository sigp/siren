import { FC, ReactElement } from 'react'
import { Control, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { sessionAuthValidation } from '../validation/sessionAuthValidation'
import { OnboardView } from '../constants/enums'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { activeDevice, deviceSettings, onBoardView } from '../recoil/atoms'
import useLocalStorage from '../hooks/useLocalStorage'
import CryptoJS from 'crypto-js'
import { useTranslation } from 'react-i18next'
import displayToast from '../utilities/displayToast'
import { DeviceListStorage } from '../types/storage'
import { ToastType } from '../types'

export interface SessionAuthForm {
  password: string
  password_confirmation: string
}

export interface RenderProps {
  control: Control<SessionAuthForm>
  isLoading: boolean
  onSubmit: () => void
}

export interface SessionAuthFormProps {
  children: (props: RenderProps) => ReactElement
}

const SessionAuthForm: FC<SessionAuthFormProps> = ({ children }) => {
  const { t } = useTranslation()
  const setView = useSetRecoilState(onBoardView)
  const viewSetup = () => setView(OnboardView.SETUP)
  const device = useRecoilValue(activeDevice)
  const setDevices = useSetRecoilState(deviceSettings)
  const [devices, storeDeviceList] = useLocalStorage<DeviceListStorage>('deviceList', undefined)

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

  const updateDevice = () => {
    const { deviceName, apiToken } = device

    const encryptedToken = CryptoJS.AES.encrypt(apiToken, password).toString()

    const formattedDevice = {
      ...device,
      apiToken: encryptedToken,
    }

    const updatedDeviceList = {
      ...devices,
      [deviceName]: formattedDevice,
    }

    setDevices(updatedDeviceList)
    storeDeviceList(updatedDeviceList)
  }

  const onSubmit = () => {
    if (!password || !isValid) {
      if (!password) {
        viewSetup()
        return
      }
      if (!isValid) displayToast(t('error.sessionAuth.invalidPassword'), ToastType.ERROR)
      return
    }

    try {
      updateDevice()
      viewSetup()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isLoading: false,
          onSubmit,
        })}
    </form>
  )
}

export default SessionAuthForm
