import React, { FC, useState } from 'react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import {
  ApiType,
  ConfigType,
  // OnboardView,
  Protocol,
} from '../constants/enums'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import useApiValidation from '../hooks/useApiValidation'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSetRecoilState } from 'recoil'
import {
  // apiToken,
  // beaconNodeEndpoint,
  beaconVersionData,
  // onBoardView,
  // userName,
  // validatorClientEndpoint,
  validatorVersionData,
} from '../recoil/atoms'
import { configValidation } from '../validation/configValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { fetchVersion } from '../api/lighthouse'
import { ApiTokenStorage, DeviceStorage, EndpointStorage, UsernameStorage } from '../types/storage'
import { fetchBeaconVersion } from '../api/beacon'
import { DeviceInfo, Endpoint } from '../types'

export type EndPointType = 'beaconNode' | 'validatorClient'

export interface ConnectionForm {
  beaconNode: Endpoint
  validatorClient: Endpoint
  apiToken: string
  deviceName: string
  userName: string
  isRemember: boolean
}

export interface RenderProps {
  control: Control<ConnectionForm>
  setValue: UseFormSetValue<ConnectionForm>
  getValues: UseFormGetValues<ConnectionForm>
  formType: ConfigType
  isValidBeaconNode: boolean
  isValidDeviceName: boolean
  deviceInfos?: DeviceInfo[]
  isValidValidatorClient: boolean
  changeFormType: (type: ConfigType) => void
  isDisabled: boolean
  isLoading: boolean
  onSubmit: () => void
}

export interface ConfigConnectionFormProps {
  children: (props: RenderProps) => React.ReactElement
}

const ConfigConnectionForm: FC<ConfigConnectionFormProps> = ({ children }) => {
  const [isLoading] = useState<boolean>(false)
  const [formType, setType] = useState<ConfigType>(ConfigType.BASIC)
  // const setView = useSetRecoilState(onBoardView)
  // const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  // const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  // const setApiToken = useSetRecoilState(apiToken)
  // const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)

  const [, storeBeaconNode] = useLocalStorage<EndpointStorage>('beaconNode', undefined)
  const [, storeApiToken] = useLocalStorage<ApiTokenStorage>('api-token', undefined)
  const [, storeValidatorClient] = useLocalStorage<EndpointStorage>('validatorClient', undefined)
  const [, storeUserName] = useLocalStorage<UsernameStorage>('username', undefined)
  const [devices, storeDevices] = useLocalStorage<DeviceStorage>('devices', undefined)

  const deviceInfos = devices && JSON.parse(devices)

  const endPointDefault = {
    protocol: Protocol.HTTP,
    address: '127.0.0.1',
    port: 5052,
  }

  const {
    control,
    setValue,
    getValues,
    watch,
    resetField,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      beaconNode: endPointDefault,
      validatorClient: {
        ...endPointDefault,
        port: 5062,
      },
      apiToken: '',
      deviceName: '',
      userName: '',
      isRemember: false,
    },
    mode: 'onChange',
    resolver: yupResolver(configValidation),
  })

  const beaconNode = watch('beaconNode')
  const validatorClient = watch('validatorClient')
  const deviceName = watch('deviceName')

  const isValidBeaconNode = useApiValidation('eth/v1/node/version', ApiType.BEACON, beaconNode)
  const isValidValidatorClient = useApiValidation(
    'lighthouse/auth',
    ApiType.VALIDATOR,
    validatorClient,
  )

  const changeFormType = (type: ConfigType) => {
    resetField('beaconNode', { defaultValue: endPointDefault })
    resetField('validatorClient', {
      defaultValue: {
        ...endPointDefault,
        port: 5062,
      },
    })
    setType(type)
  }

  const handleError = (e: unknown) => {
    let message = 'Unknown Error'
    if (e instanceof AxiosError && e.response?.status === 403) {
      message = 'Invalid Api Token'
    }

    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      theme: 'colored',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    })
  }

  const isValidDeviceName =
    deviceInfos && deviceName
      ? !deviceInfos.find((device: DeviceInfo) => device.deviceName === deviceName)
      : true

  const onSubmit = async () => {
    const { isRemember, apiToken, userName, deviceName } = getValues()

    try {
      const [vcResult, beaconResult] = await Promise.all([
        fetchVersion(validatorClient, apiToken),
        fetchBeaconVersion(beaconNode),
      ])

      if (vcResult.status !== 200 && beaconResult.status !== 200) {
        handleError('')
        return
      }

      setValidatorVersion(vcResult.data.data.version)
      setBeaconVersion(beaconResult.data.data.version)

      if (isRemember) {
        storeBeaconNode(beaconNode)
        storeValidatorClient(validatorClient)
        storeApiToken(apiToken)
        storeUserName(userName)
      }

      const device = {
        beaconNode,
        validatorClient,
        apiToken,
        deviceName,
      }

      storeDevices(JSON.stringify([device, ...deviceInfos]))

      // setUserName(userName)
      // setApiToken(apiToken)
      // setBeaconNode(beaconNode)
      // setValidatorClient(validatorClient)
      // setView(OnboardView.SETUP)
    } catch (e) {
      handleError(e)
    }
  }

  return (
    <form>
      {children &&
        children({
          control,
          setValue,
          isLoading,
          getValues,
          onSubmit,
          deviceInfos,
          changeFormType,
          isValidBeaconNode,
          isValidValidatorClient,
          isValidDeviceName,
          formType,
          isDisabled:
            !isValid || !isValidBeaconNode || !isValidValidatorClient || !isValidDeviceName,
        })}
    </form>
  )
}

export default ConfigConnectionForm
