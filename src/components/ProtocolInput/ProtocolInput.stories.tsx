import ProtocolInput, { ProtocolInputProps } from './ProtocolInput'
import { Story } from '@storybook/react'
import { Control, useForm, UseFormGetValues } from 'react-hook-form'
import React, { FC } from 'react'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'

export interface RenderProps {
  control: Control<any>
  setValue: UseFormSetValue<any>
  getValues: UseFormGetValues<any>
}

export default {
  key: 'Protocol Input',
  component: ProtocolInput,
}

const MockConnectionForm: FC<{ children: (props: RenderProps) => React.ReactElement }> = ({
  children,
}) => {
  const { control, setValue, getValues } = useForm()

  return (
    <form>
      {children &&
        children({
          control,
          setValue,
          getValues,
        })}
    </form>
  )
}

const Template: Story<ProtocolInputProps> = ({ type, id, isValid }) => (
  <MockConnectionForm>
    {({ control, getValues, setValue }) => (
      <div className='h-screen w-screen bg-black flex flex-col items-center justify-center'>
        <div className='w-full max-w-xl'>
          <ProtocolInput
            id={id}
            setValue={setValue}
            getValues={getValues as any}
            control={control as any}
            type={type}
            isValid={isValid}
          />
        </div>
      </div>
    )}
  </MockConnectionForm>
)

export const Basic = Template.bind({})
Basic.args = {
  id: 'basic',
}

export const BeaconInput = Template.bind({})
BeaconInput.args = {
  id: 'beacon',
  type: 'beaconNode',
}

export const VCInput = Template.bind({})
VCInput.args = {
  id: 'validator',
  type: 'validatorClient',
}

export const SuccessInput = Template.bind({})
SuccessInput.args = {
  id: 'validator',
  type: 'validatorClient',
  isValid: true,
}
