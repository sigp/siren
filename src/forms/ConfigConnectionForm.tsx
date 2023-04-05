import React, { FC, useEffect, useState } from 'react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import { ApiType, ConfigType, ContentView, OnboardView, Protocol } from '../constants/enums'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import useApiValidation from '../hooks/useApiValidation'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSetRecoilState } from 'recoil'
import {
  apiToken,
  beaconNodeEndpoint,
  beaconVersionData,
  dashView,
  onBoardView,
  userName,
  validatorClientEndpoint,
  validatorVersionData,
} from '../recoil/atoms'
import { configValidation } from '../validation/configValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { fetchVersion } from '../api/lighthouse'
import { EndpointStorage } from '../types/storage'
import { fetchBeaconVersion } from '../api/beacon'
import { Endpoint } from '../types'
import { useTranslation } from 'react-i18next'
import isRequiredVersion from '../utilities/isRequiredVersion'
import { REQUIRED_VALIDATOR_VERSION } from '../constants/constants'
import CryptoJS from 'crypto-js'
import { ENCRYPT_KEY } from '../constants/window'

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
}

export interface ConfigConnectionFormProps {
  children: (props: RenderProps) => React.ReactElement
}

const ConfigConnectionForm: FC<ConfigConnectionFormProps> = ({ children }) => {
  const { t } = useTranslation()
  const [isLoading] = useState<boolean>(false)
  const [formType, setType] = useState<ConfigType>(ConfigType.BASIC)
  const setView = useSetRecoilState(onBoardView)
  const setDashView = useSetRecoilState(dashView)
  const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setApiToken = useSetRecoilState(apiToken)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const [isInitialApiCheck, setIsInitialApiCheck] = useState(true)
  const [isVersionError, setVersionError] = useState(false)

  const [storedBnNode, storeBeaconNode] = useLocalStorage<EndpointStorage>('beaconNode', undefined)
  const [storedToken, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [storedVc, storeValidatorClient] = useLocalStorage<EndpointStorage>(
    'validatorClient',
    undefined,
  )
  const [storedName, storeUserName] = useLocalStorage<string>('username', '')

  const hasCache =
    Boolean(storedBnNode) && Boolean(storedVc) && Boolean(storedToken) && Boolean(storedName)

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
      apiToken: storedToken,
      deviceName: '',
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

    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      theme: 'colored',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    })
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

    const { isRemember, apiToken, userName, beaconNode, validatorClient } = values

    try {
      const [vcResult, beaconResult] = await Promise.all([
        fetchVersion(validatorClient, apiToken),
        fetchBeaconVersion(beaconNode),
      ])

      const vcVersion = vcResult.data.data.version

      if (!isRequiredVersion(vcVersion, REQUIRED_VALIDATOR_VERSION)) {
        setVersionError(true)
        return
      }

      setValidatorVersion(vcVersion)
      setBeaconVersion(beaconResult.data.data.version)

      if (isRemember) {
        storeBeaconNode(beaconNode)
        storeValidatorClient(validatorClient)
        storeApiToken(CryptoJS.AES.encrypt(apiToken, ENCRYPT_KEY).toString())
        storeUserName(userName)
      }

      setUserName(userName)
      setApiToken(apiToken)
      setBeaconNode(beaconNode)
      setValidatorClient(validatorClient)
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
        })}
    </form>
  )
}

export default ConfigConnectionForm
