import {FC, useState} from "react";
import {Control, useForm, UseFormGetValues} from "react-hook-form";
import {ConfigType, Protocol} from "../constants/enums";
import {UseFormSetValue} from "react-hook-form/dist/types/form";

export type EndPointType = 'beaconNode' | 'validatorClient';

export type Endpoint = {
    protocol: Protocol,
    address: string,
    port: number
}

export interface ConnectionForm {
    beaconNode: Endpoint,
    validatorClient: Endpoint,
    apiToken: string,
    deviceName: string,
    userName: string
    isRemember: boolean
}

export interface RenderProps {
    control: Control<ConnectionForm>
    setValue: UseFormSetValue<ConnectionForm>
    getValues: UseFormGetValues<ConnectionForm>
    formType: ConfigType
    changeFormType: (type: ConfigType) => void
    isDisabled: boolean
    isLoading: boolean
    onSubmit: () => void
}

export interface ConfigConnectionFormProps {
    children: (props: RenderProps) => any
}

const ConfigConnectionForm:FC<ConfigConnectionFormProps> = ({children}) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [formType, setType] = useState<ConfigType>(ConfigType.BASIC);
    const endPointDefault = {
        protocol: Protocol.HTTP,
        address: '127.0.0.1',
        port: 5052
    }

    const {
        control,
        setValue,
        getValues,
        reset,
        formState: {isValid}
    } = useForm({
        defaultValues: {
            beaconNode: endPointDefault,
            validatorClient: {
                ...endPointDefault,
                port: 5062
            },
            apiToken: '',
            deviceName: '',
            userName: '',
            isRemember: false
        }
    });

    const changeFormType = (type: ConfigType) => {
        reset({
            beaconNode: endPointDefault,
            validatorClient: {
                ...endPointDefault,
                port: 5062
            },
        })
        setType(type);
    }

    const onSubmit = () => {}

  return (
      <form>
          {
              children && children({
                  control,
                  setValue,
                  isLoading,
                  getValues,
                  onSubmit,
                  changeFormType,
                  formType,
                  isDisabled: !isValid,
              })
          }
      </form>
  )
}

export default ConfigConnectionForm;