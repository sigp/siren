import ProtocolInput, {ProtocolInputProps} from "./ProtocolInput";
import {Story} from "@storybook/react";
import ConfigConnectionForm from "../../forms/ConfigConnectionForm";

export default {
    key: 'Protocol Input',
    component: ProtocolInput
}

const Template:Story<ProtocolInputProps> = ({type, id, isValid}) => (
    <ConfigConnectionForm>
        {({control, setValue, getValues}) => (
            <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
                <ProtocolInput id={id} setValue={setValue} getValues={getValues} control={control} type={type} isValid={isValid} />
            </div>
        )}
    </ConfigConnectionForm>
);


export const Basic = Template.bind({});
Basic.args = {
    id: 'basic'
};

export const BeaconInput = Template.bind({});
BeaconInput.args = {
    id: 'beacon',
    type: 'beaconNode'
};

export const VCInput = Template.bind({});
VCInput.args = {
    id: 'validator',
    type: 'validatorClient'
};

export const SuccessInput = Template.bind({});
SuccessInput.args = {
    id: 'validator',
    type: 'validatorClient',
    isValid: true
};