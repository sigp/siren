import React, { FC, useState } from 'react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import { ApiType, ConfigType, OnboardView, Protocol } from '../constants/enums'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import useApiValidation from '../hooks/useApiValidation'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSetRecoilState } from 'recoil'
import {
  apiToken,
  beaconNodeEndpoint,
  beaconVersionData,
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
import { ApiTokenStorage, EndpointStorage, UsernameStorage } from '../types/storage'
import { fetchBeaconVersion } from '../api/beacon'
import { Endpoint } from '../types'
import { useTranslation } from 'react-i18next'

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
  changeFormType: (type: ConfigType) => void
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
  const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const setValidatorVersion = useSetRecoilState(validatorVersionData)
  const setApiToken = useSetRecoilState(apiToken)
  const setUserName = useSetRecoilState(userName)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)

  const [, storeBeaconNode] = useLocalStorage<EndpointStorage>('beaconNode', undefined)
  const [, storeApiToken] = useLocalStorage<ApiTokenStorage>('api-token', undefined)
  const [, storeValidatorClient] = useLocalStorage<EndpointStorage>('validatorClient', undefined)
  const [, storeUserName] = useLocalStorage<UsernameStorage>('username', undefined)

  const endPointDefault = {
    protocol: Protocol.HTTP,
    address: '127.0.0.1',
    port: 5052,
  }

  const { control, setValue, getValues, watch, resetField, trigger } = useForm({
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

      setValidatorVersion(vcResult.data.data.version)
      setBeaconVersion(beaconResult.data.data.version)

      if (isRemember) {
        storeBeaconNode(beaconNode)
        storeValidatorClient(validatorClient)
        storeApiToken(apiToken)
        storeUserName(userName)
      }

      setUserName(userName)
      setApiToken(apiToken)
      setBeaconNode(beaconNode)
      setValidatorClient(validatorClient)
      setView(OnboardView.SETUP)
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
          changeFormType,
          isValidBeaconNode,
          isValidValidatorClient,
          formType,
        })}
    </form>
  )
}

export default ConfigConnectionForm
