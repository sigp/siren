import {FC, useState} from "react";
import {Control, useForm, UseFormGetValues} from "react-hook-form";
import {ConfigType, OnboardView, Protocol} from "../constants/enums";
import {UseFormSetValue} from "react-hook-form/dist/types/form";
import useApiValidation from "../hooks/useApiValidation";
import useLocalStorage from "../hooks/useLocalStorage";
import {useSetRecoilState} from "recoil";
import {beaconNodeEndpoint, onBoardView, validatorClientEndpoint} from "../recoil/atoms";

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
    isValidBeaconNode: boolean
    isValidValidatorClient: boolean
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
    const setBeaconNode = useSetRecoilState(beaconNodeEndpoint);
    const setView = useSetRecoilState(onBoardView);
    const setValidatorClient = useSetRecoilState(validatorClientEndpoint);

    const [ , storeBeaconNode ] = useLocalStorage<Endpoint | undefined>('beaconNode', undefined);
    const [ , storeValidatorClient ] = useLocalStorage<Endpoint | undefined>('validatorClient', undefined);

    const endPointDefault = {
        protocol: Protocol.HTTP,
        address: '127.0.0.1',
        port: 5052
    }

    const {
        control,
        setValue,
        getValues,
        watch,
        resetField,
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

    const beaconNode = watch('beaconNode');
    const validatorClient = watch('validatorClient');

    const isValidBeaconNode = useApiValidation(beaconNode,  'eth/v1/node/version');
    const isValidValidatorClient = useApiValidation(validatorClient,  'lighthouse/auth');

    const changeFormType = (type: ConfigType) => {
        resetField('beaconNode', {defaultValue: endPointDefault});
        resetField('validatorClient', {defaultValue: {
                ...endPointDefault,
                port: 5062
            }});
        setType(type);
    }

    const onSubmit = () => {
        const { isRemember } = getValues();

        if(isRemember) {
            storeBeaconNode(beaconNode);
            storeValidatorClient(validatorClient);
        }

        setBeaconNode(beaconNode);
        setValidatorClient(validatorClient);
        setView(OnboardView.SETUP);
    }
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
                  isValidBeaconNode,
                  isValidValidatorClient,
                  formType,
                  isDisabled: !isValid,
              })
          }
      </form>
  )
}

export default ConfigConnectionForm;