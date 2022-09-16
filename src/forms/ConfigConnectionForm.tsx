import {FC, useState} from "react";
import {Control, useForm} from "react-hook-form";

export interface ConnectionForm {
    beaconNodeProtocol: string,
    beaconNodeAddress: string,
    beaconNodePort: string,
    validatorClientProtocol: string,
    validatorClientAddress: string,
    validatorClientPort: string,
    apiToken: string,
    deviceName: string,
    userName: string
    isRemember: boolean
}

export interface RenderProps {
    control: Control<ConnectionForm>
    isDisabled: boolean
    isLoading: boolean
    onSubmit: () => void
}

export interface ConfigConnectionFormProps {
    children: (props: RenderProps) => any
}

const ConfigConnectionForm:FC<ConfigConnectionFormProps> = ({children}) => {
    const [isLoading, setLoading] = useState<boolean>(false);

    const {
        control,
        formState: {isValid}
    } = useForm({
        defaultValues: {
            beaconNodeProtocol: '',
            beaconNodeAddress: '',
            beaconNodePort: '',
            validatorClientProtocol: '',
            validatorClientAddress: '',
            validatorClientPort: '',
            apiToken: '',
            deviceName: '',
            userName: '',
            isRemember: false
        }
    });

    const onSubmit = () => {

    }

  return (
      <form>
          {
              children && children({
                  control,
                  isLoading,
                  onSubmit,
                  isDisabled: !isValid,
              })
          }
      </form>
  )
}

export default ConfigConnectionForm;