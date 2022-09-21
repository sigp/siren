import {Control, Controller, UseFormGetValues} from "react-hook-form";
import Toggle from "../Toggle/Toggle";
import {ChangeEvent, FC} from "react";
import {UseFormSetValue} from "react-hook-form/dist/types/form";
import {ConnectionForm, EndPointType} from "../../forms/ConfigConnectionForm";
import {Protocol} from "../../constants/enums";
import Typography from "../Typography/Typography";

export interface ProtocolInputProps {
    id: string,
    type?: EndPointType,
    control: Control<ConnectionForm>
    setValue: UseFormSetValue<ConnectionForm>
    getValues: UseFormGetValues<ConnectionForm>,
    isValid?: boolean
}

const ProtocolInput:FC<ProtocolInputProps> = ({id, control, setValue, getValues, type, isValid}) => {
    const defaultType = type || 'beaconNode';
    const protocol = getValues(`${defaultType}.protocol`)
    const onChangeProtocol = (value: boolean) => {
        const protocolValue = value ? Protocol.HTTPS : Protocol.HTTP;
        if(type) {
            setValue(`${type}.protocol`, protocolValue, {shouldValidate: true});
            return;
        }

        setValue('beaconNode.protocol', protocolValue);
        setValue('validatorClient.protocol', protocolValue);
    }
    const onChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(type) {
            setValue(`${type}.address`, value);
            return;
        }

        setValue('beaconNode.address', value);
        setValue('validatorClient.address', value);
    }
    const onChangePort = (e: ChangeEvent<HTMLInputElement>) => {
        if(!type) return;
        // @ts-ignore
        setValue(`${type}.port`, e.target.value ? Number(e.target.value) : '');
    }

 return (
     <div className="flex items-end justify-between border-b border-white w-full pb-4">
         <div className="flex flex-wrap space-x-1 md:space-x-4">
             <div className="space-y-4">
                 <div className="flex">
                     <Typography isBold color="text-dark500" className="w-16 flex-grow-0 uppercase" type="text-tiny">Protocol (http/https)</Typography>
                     <i className="bi-question-circle-fill text-caption2 md:text-caption1 text-dark500" />
                 </div>
                 <Controller
                     name={`${defaultType}.protocol`}
                     control={control}
                     render={({field: {ref: _ref, value}}) => (
                         <Toggle id={id} value={value === Protocol.HTTPS} onChange={onChangeProtocol}/>
                     )}
                 />
             </div>
             <div className="space-y-4">
                 <div className="flex space-x-2 items-center">
                     <Typography isBold color="text-dark500" className="flex-grow-0 uppercase md:text-caption1" type="text-caption2">{`${type === 'validatorClient' ? 'VC' : 'Beacon'} ADDRESS`}</Typography>
                     <i className="bi-question-circle-fill text-caption2 md:text-caption1  text-dark500" />
                 </div>
                 <div className="relative flex w-28 md:w-44 items-center">
                     <Typography color="text-dark500" className="flex-grow-0 lowercase md:text-subtitle2">{`${protocol}://`}</Typography>
                     <Controller
                         name={`${type || 'beaconNode'}.address`}
                         control={control}
                         render={({field: {ref: _ref, value}}) => (
                             <input className="text-body w-full md:text-subtitle2 flex-1 bg-transparent text-white outline-none" type="text" value={value} onChange={onChangeAddress} />
                         )}
                     />
                 </div>
             </div>
             {
                 !type ? (
                     <>
                         <div className="space-y-4">
                             <div className="flex space-x-2 items-center">
                                 <Typography isBold color="text-dark500" className="flex-grow-0 uppercase md:text-caption1" type="text-caption2">BN Port</Typography>
                                 <i className="bi-question-circle-fill text-caption2 md:text-caption1  text-dark500" />
                             </div>
                             <Controller
                                 name="beaconNode.port"
                                 control={control}
                                 render={({field: {ref: _ref, ...props}}) => (
                                     <input className="text-body md:text-subtitle2 w-20 bg-transparent text-white outline-none appearance-none" type="number" {...props} />
                                 )}
                             />
                         </div>
                         <div className="space-y-4">
                             <div className="flex space-x-2 items-center">
                                 <Typography isBold color="text-dark500" className="flex-grow-0 uppercase md:text-caption1" type="text-caption2">VC Port</Typography>
                                 <i className="bi-question-circle-fill text-caption2 md:text-caption1  text-dark500" />
                             </div>
                             <Controller
                                 name="validatorClient.port"
                                 control={control}
                                 render={({field: {ref: _ref, ...props}}) => (
                                     <input className="text-body md:text-subtitle2 w-20 bg-transparent text-white outline-none appearance-none" type="number" {...props} />
                                 )}
                             />
                         </div>
                     </>
                 ) : (
                     <div className="space-y-4">
                         <div className="flex space-x-2 items-center">
                             <Typography isBold color="text-dark500" className="flex-grow-0 uppercase md:text-caption1" type="text-caption2">{`${type === 'beaconNode' ? 'BN' : 'VC'} Port`}</Typography>
                             <i className="bi-question-circle-fill text-caption2 md:text-caption1  text-dark500" />
                         </div>
                         <Controller
                             name={`${defaultType}.port`}
                             control={control}
                             render={({field: {ref: _ref, value}}) => (
                                 <input className="text-body md:text-subtitle2 w-20 bg-transparent text-white outline-none appearance-none" type="number" value={value} onChange={onChangePort} />
                             )}
                         />
                     </div>
                 )
             }
         </div>
         <i className={`bi-check-circle-fill text-body md:text-subtitle2 ${isValid ? 'text-success' : 'text-dark500'}`} />
     </div>
 )
}

export default ProtocolInput;