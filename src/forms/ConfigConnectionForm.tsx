import React, { FC, useState } from 'react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import { ConfigType, OnboardView, Protocol } from '../constants/enums'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import useApiValidation from '../hooks/useApiValidation'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSetRecoilState } from 'recoil'
import { apiToken, beaconNodeEndpoint, onBoardView, validatorClientEndpoint } from '../recoil/atoms'
import { configValidation } from '../validation/configValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { fetchVersion } from '../api/lighthouse';
import { ApiTokenStorage, EndpointStorage } from '../types/storage';

export type EndPointType = 'beaconNode' | 'validatorClient'

export type Endpoint = {
  protocol: Protocol
  address: string
  port: number
}

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
  const setView = useSetRecoilState(onBoardView)
  const setBeaconNode = useSetRecoilState(beaconNodeEndpoint)
  const setValidatorClient = useSetRecoilState(validatorClientEndpoint)
  const setApiToken = useSetRecoilState(apiToken)

  const [, storeBeaconNode] = useLocalStorage<EndpointStorage>('beaconNode', undefined)
  const [, storeApiToken] = useLocalStorage<ApiTokenStorage>('api-token', undefined)
  const [, storeValidatorClient] = useLocalStorage<EndpointStorage>(
    'validatorClient',
    undefined,
  )

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

  const isValidBeaconNode = useApiValidation('eth/v1/node/version', beaconNode)
  const isValidValidatorClient = useApiValidation('lighthouse/auth', validatorClient)

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

  const onSubmit = async () => {
    const { isRemember, apiToken } = getValues()

    try {
      const { status } = await fetchVersion(validatorClient, apiToken);

      if (status !== 200) {
        handleError('')
        return
      }

      if (isRemember) {
        storeBeaconNode(beaconNode)
        storeValidatorClient(validatorClient)
        storeApiToken(apiToken)
      }

      setApiToken(apiToken)
      setBeaconNode(beaconNode)
      setValidatorClient(validatorClient)
      setView(OnboardView.SETUP)
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
          changeFormType,
          isValidBeaconNode,
          isValidValidatorClient,
          formType,
          isDisabled: !isValid || !isValidBeaconNode || !isValidValidatorClient,
        })}
    </form>
  )
}

export default ConfigConnectionForm
