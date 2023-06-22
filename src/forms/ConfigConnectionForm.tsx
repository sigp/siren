import React, { FC, useEffect, useState } from 'react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import { ApiType, ConfigType, ContentView, OnboardView, Protocol } from '../constants/enums'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import useApiValidation from '../hooks/useApiValidation'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSetRecoilState } from 'recoil'
import {
  activeDevice,
  beaconVersionData,
  dashView,
  deviceSettings,
  onBoardView,
  userName,
  validatorVersionData,
} from '../recoil/atoms'
import { configValidation } from '../validation/configValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { fetchVersion } from '../api/lighthouse'
import { DeviceKeyStorage, DeviceListStorage } from '../types/storage'
import { fetchBeaconVersion } from '../api/beacon'
import { DeviceList, Endpoint } from '../types'
import { useTranslation } from 'react-i18next'
import isRequiredVersion from '../utilities/isRequiredVersion'
import { REQUIRED_VALIDATOR_VERSION } from '../constants/constants'
import displayToast from '../utilities/displayToast'
import formatEndpoint from '../utilities/formatEndpoint'
import parseEndpointString from '../utilities/parseEndpointString'

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
  isValidValidatorClient: boolean
  isVersionError: boolean
  setType: (type: ConfigType) => void
  isLoading: boolean
  onSubmit: () => void
  devices?: DeviceList
  hasMultiDevice: boolean
  isAddDevice: boolean
  toggleDeviceInput: () => void
  storedDeviceName?: string
}

export interface ConfigConnectionFormProps {
  children: (props: RenderProps) => React.ReactElement
}

const ConfigConnectionForm: FC<ConfigConnectionFormProps> = ({ children }) => {
  const { t } = useTranslation()
  const [isLoading] = useState<boolean>(false)
  const [formType, setType] = useState<ConfigType>(ConfigType.BASIC)
  const setDevices = useSetRecoilState(deviceSettings)
  const setView = useSetRecoilState(onBoardView)
  const setDashView = useSetRecoilState(dashView)
  const setActiveDevice = useSetRecoilState(activeDevice)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const [isInitialApiCheck, setIsInitialApiCheck] = useState(true)
  const [isVersionError, setVersionError] = useState(false)
  const [isAddDevice, toggleInput] = useState(false)
  const [devices, storeDeviceList] = useLocalStorage<DeviceListStorage>('deviceList', undefined)
  const [deviceKey, storeDeviceKey] = useLocalStorage<DeviceKeyStorage>('deviceKey', undefined)

  const hasMultiDevice = Object.keys(devices || {}).length > 1

  const storedDevice = devices?.[deviceKey || '']
  const storedBnNode = parseEndpointString(storedDevice?.beaconUrl)
  const storedVc = parseEndpointString(storedDevice?.validatorUrl)

  const [storedName, storeUserName] = useLocalStorage<string>('username', '')

  const hasCache = Boolean(storedDevice) && Boolean(storedName)

  const endPointDefault = {
    protocol: Protocol.HTTP,
    address: '127.0.0.1',
    port: 5052,
  }

  const vcDefaultEndpoint = {
    ...endPointDefault,
    port: 5062,
  }

  const { control, setValue, getValues, watch, trigger } = useForm({
    defaultValues: {
      beaconNode: storedBnNode || endPointDefault,
      validatorClient: storedVc || vcDefaultEndpoint,
      apiToken: '',
      deviceName: storedDevice?.deviceName || '',
      userName: storedName,
      isRemember: hasCache,
    },
    mode: 'onChange',
    resolver: yupResolver(configValidation),
  })

  const beaconNode = watch('beaconNode')
  const validatorClient = watch('validatorClient')

  useEffect(() => {
    setIsInitialApiCheck(false)
  }, [beaconNode, validatorClient])

  useEffect(() => {
    if (devices) {
      setDevices(devices)
    }
  }, [devices])

  const isValidBeaconNode = useApiValidation(
    'eth/v1/node/version',
    ApiType.BEACON,
    !isInitialApiCheck,
    beaconNode,
  )
  const isValidValidatorClient = useApiValidation(
    'lighthouse/auth',
    ApiType.VALIDATOR,
    !isInitialApiCheck,
    validatorClient,
  )

  const handleError = (e: unknown) => {
    let message = 'Unknown Error'
    const requiredErrors = [
      'beaconDataRequired',
      'validatorDataRequired',
      'userName.required',
      'apiTokenRequired',
      'userName.maxLength',
    ]
    const invalidNodeErrors = ['invalidBeacon', 'invalidValidator']

    if (requiredErrors.includes(e as string)) {
      message = t(`error.${e}`)
    }

    if (invalidNodeErrors.includes(e as string)) {
      message = t('error.networkError', {
        type: e === 'invalidBeacon' ? ApiType.BEACON : ApiType.VALIDATOR,
      })
    }

    if (e instanceof AxiosError && e.response?.status === 403) {
      message = t('error.invalidApiToken')
    }
    displayToast(message, 'error')
  }

  const toggleDeviceInput = () => {
    if (Object.keys(devices || {}).length) {
      toggleInput((prev) => !prev)
    }
  }

  const validationErrors = (values: ConnectionForm) => {
    const { apiToken, userName, beaconNode, validatorClient } = values
    const errors = []

    const isValidBeacon = Object.values(beaconNode).every((v) => Boolean(v))
    const isValidValidator = Object.values(validatorClient).every((v) => Boolean(v))

    if (!isValidBeacon) {
      errors.push('beaconDataRequired')
    }

    if (!isValidValidator) {
      errors.push('validatorDataRequired')
    }

    if (!userName) {
      errors.push('userName.required')
    }

    if (userName?.length > 14) {
      errors.push('userName.maxLength')
    }

    if (!apiToken) {
      errors.push('apiTokenRequired')
    }

    return errors
  }

  const onSubmit = async () => {
    const values = getValues()
    setVersionError(false)

    const errors = validationErrors(values)

    if (errors.length) {
      errors.forEach((error) => handleError(error))
      await trigger()
      return
    }

    const { isRemember, apiToken, userName, beaconNode, validatorClient, deviceName } = values
    const formattedBnEndpoint = formatEndpoint(beaconNode) as string
    const formattedVcEndpoint = `${formatEndpoint(validatorClient)}/lighthouse`
    const settingName = deviceName || 'localhost'
    const device = {
      validatorUrl: formattedVcEndpoint,
      beaconUrl: formattedBnEndpoint,
      deviceName: settingName,
    }

    try {
      const [vcResult, beaconResult] = await Promise.all([
        fetchVersion(formattedVcEndpoint, apiToken),
        fetchBeaconVersion(formattedBnEndpoint),
      ])

      const vcVersion = vcResult.data.data.version

      if (!isRequiredVersion(vcVersion, REQUIRED_VALIDATOR_VERSION)) {
        setVersionError(true)
        return
      }

      setValidatorVersion(vcVersion)
      setBeaconVersion(beaconResult.data.data.version)

      if (isRemember) {
        storeUserName(userName)

        storeDeviceKey(settingName)
        storeDeviceList({ ...devices, [settingName]: device })
      }

      setDevices((prev: DeviceList) => ({
        ...prev,
        [settingName]: device,
      }))

      setActiveDevice({
        ...device,
        apiToken,
      })

      setUserName(userName)
      setDashView(ContentView.MAIN)
      setView(OnboardView.SESSION)
    } catch (e) {
      if (!isValidBeaconNode || !isValidValidatorClient) {
        if (!isValidBeaconNode) {
          handleError('invalidBeacon')
        }

        if (!isValidValidatorClient) {
          handleError('invalidValidator')
        }
        return
      }
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
          setType,
          isValidBeaconNode,
          isValidValidatorClient,
          isVersionError,
          formType,
          devices,
          isAddDevice,
          toggleDeviceInput,
          hasMultiDevice,
          storedDeviceName: storedDevice?.deviceName,
        })}
    </form>
  )
}

export default ConfigConnectionForm
